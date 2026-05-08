import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FriendRequest from "../models/friendRequest.model.js";
import redisClient from './../server.js';
import generateEmbeddings from "../utils/Embeddings.js";




const getRecommendedUsers = asyncHandler(async (req, res) => {
   
   const currentUserId = req.user._id;
   

    //checking if recommendedUsers is already cached using redis
    const cacheKey = `recommendations:user:${currentUserId}`
    const cachedRecommendations =await redisClient.get(cacheKey);
    if(cachedRecommendations){
        console.log("returning cached result");
        const parsedCache = JSON.parse(cachedRecommendations);
        return res.status(200).json(new ApiResponse(200,parsedCache,"returning cached recommended users"))
    }
    console.log("computing recommendations");

    //check first in redis then mongoDB query
     const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }


    // function cosineSimilarity(a,b){
    // let dot =0,norm_a=0,norm_b=0;

    // for(let i=0;i<a.length;i++){
    //     dot += a[i]*b[i];
    //     norm_a+= a[i]*a[i];
    //     norm_b += b[i]*b[i];
    // }

    // return  dot/ (Math.sqrt(norm_a)*Math.sqrt(norm_b) );
    // }

    function cosineSimilarity(a, b) {
  if (!a || !b) return -1;
  if (a.length !== b.length || a.length === 0) return -1;

  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]*b[i];
  }
  return dot;
}



    const otherUser = await User.find({
        _id:{
            $ne: currentUserId,
            $nin: currentUser.friend
        },
        isOnboarded:true
    }).select("fullName avatar location skills bio embeddings");
    

    // const recommendedUser = otherUser.map((other)=>{
    //     const similarity = cosineSimilarity(other.embeddings,currentUser.embeddings);

    //     return {
    //         user: other,
    //         score : similarity
    //     }
    // }
    // ).sort((a,b)=> b.score-a.score)
    // .slice(0,20) // to limit the number of user recommended

    const recommendedUser = otherUser
  .map(other => {
    const score = cosineSimilarity(other.embeddings, currentUser.embeddings);
    return { user: other, score };
  })
  .filter(u => u.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);



    //v1 Used direct word matching 
    // const recommendedUser = await User.find({
    //     _id: { 
    //         $ne: currentUserId,           // exclude current user
    //         $nin: currentUser.friend      // exclude current user's friends
    //     },
    //     isOnboarded: true,
    //     skills: { $in: currentUser.skills } // match users who have at least one skill in common
    // }).select("fullName avatar location skills bio");

    if (recommendedUser.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No recommended users found"));
    }

    //REDIS-CACHING
    await redisClient.setEx(
        cacheKey,
        60*60*24, // 1day
        JSON.stringify(recommendedUser)
    )
   
    return res.status(200).json(new ApiResponse(200, recommendedUser, "Recommended users fetched successfully"));
    
});

const getMyFriends = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    if (!currentUserId) {
        throw new ApiError(404, "User not found");
    }
    const currentuser = await User.findById(currentUserId)
    .select("friend")// Include only the 'friend' field from User
    .populate("friend", "fullName avatar location skills bio"); // Populate 'friend' field and return only these subfields

   
    // const friends = currentuser.friend;

    // if (friend.length === 0) {
    //     return res.status(200).json(new ApiResponse("No friends found", []));
    // }

    return res.status(200).json(new ApiResponse(200, currentuser, "Friends fetched successfully"));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
    const senderId = req.user._id;

    // Assume recipientId is the ID of the user you want to send a friend request to
// in frontend => axios.post(`/api/user/friend-request/${recipientId}`)
    const recipientId = req.params.id;
    
    // console.log("senderId:", senderId);
    // console.log("recipientId:", recipientId);
    
    //prevent self friend request
    if (senderId.toString() === recipientId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    if (!recipientId) {
        throw new ApiError(400, "Recipient ID is required");
    }

    const recipient = await User.findById(recipientId);
    
    if (!recipient) {
        throw new ApiError(404, "User not found");
    }

    //if user is already friends
    if (recipient.friend.includes(senderId)) {
        return res.status(400).json({ message: "You are already friends with this user" });
    }

    //if request already exist 
    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId }
        ]
    });

    if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent or received" });
    }

    const friendRequest = await FriendRequest.create({
        sender: senderId,
        recipient: recipientId,
    })

    if (friendRequest) {
        //to prevent showing recommended user to already sent friend requests
        await redisClient.del(`recommendations:user:${senderId}`);
        return res.status(200).json(new ApiResponse(200, friendRequest, "Friend Request sent"));
    }
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
        throw new ApiError(404, "Friend request not found");
    }
    const senderId = request.sender;
    const recipientId = request.recipient;
    if (!senderId || !recipientId) {
        throw new ApiError(400, "Invalid friend request");
    }
    if (request.status === "pending") {
        request.status = "accepted";
        await request.save();
    } else {
        throw new ApiError(400, "No Pending request");
    }
    const sender = await User.findByIdAndUpdate(senderId, {
        $addToSet: { friend: recipientId }
    });
    const recipient = await User.findByIdAndUpdate(recipientId, {
        $addToSet: { friend: senderId }
    });
    if (!sender || !recipient) {
        throw new ApiError(500, "Friend request not accepted ");
    }
    return res.status(200).json(new ApiResponse(200, { sender, recipient }, "Friend request accepted"));
});

const getFriendRequests = asyncHandler ( async (req,res) => {
  const incommingRequest = await FriendRequest.find(
    {recipient : req.user._id,
     status: "pending",
    }
  ).populate("sender","fullName avatar skills location");

  const acceptedRequest = await FriendRequest.find(
     {recipient : req.user._id,
     status: "accepted",
    }
  ).populate("sender","fullName avatar skills location");

  return res.status(200).json(new ApiResponse(200,{incommingRequest,acceptedRequest},
    "Incoming and accepted requests fetched successfully "
  ))
});
const getOutgoingFriendRequests= asyncHandler(async(req,res)=>{
     const outgoingRequests = await FriendRequest.find(
        {
            sender : req.user._id,
            status: "pending"
        }
     ).populate("recipient","fullName avatar skills location")


     return res.status(200).json(new ApiResponse(200,outgoingRequests,
     "Outgoing requests fetched successfully"
  ))
});

const rejectFriendRequest = asyncHandler (async (req,res) => {
     const requestId = req.params.id;

     const request  = await FriendRequest.findById(requestId);
     if (!request) {
        throw new ApiError(404, "Friend request not found");
    }

    if(request.status == "pending"){
     request.status= "rejected";
     await request.save({validateBeforeSave:false});
    }
    else{
        throw new ApiError(400,"No valid friend request");
    }

    return res.status(200).json(new ApiResponse(200,{},"Friend request rejected successfully"));
})


const editProfile = asyncHandler (async (req,res) => {
        const reqId= req.user._id;
        //leaving the avatar for now 
        const {fullName, bio, skills, location} = req.body;
        if (!Array.isArray(skills)) {
        throw new ApiError(400, "Skills must be an array");
    }
        

         const profileText = `bio : ${bio}\nskills : ${skills.join(", ")}`;
    const newEmbeddings = await generateEmbeddings(profileText);
       

        const editedUser =  await User.findByIdAndUpdate(
            reqId,
            {
                fullName,
                bio,
                skills,
                location,
                embeddings: newEmbeddings,
            },
            {new:true}
        ).select("-password -refreshToken");


        if(!editedUser) {
            throw new ApiError(500,"Can not edit user details at this moment");
        }
     //refresh recommended Users
        await redisClient.del(`recommendations:user:${reqId}`);


        return res.status(200).json(new ApiResponse(200,editedUser,"User details updated successfully"));

})




export { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest,
    getFriendRequests,getOutgoingFriendRequests, rejectFriendRequest,editProfile};