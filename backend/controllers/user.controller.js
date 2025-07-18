import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FriendRequest from "../models/friendRequest.model.js";

const getRecommendedUsers = asyncHandler(async (req, res) => {
   const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    
    const recommendedUser = await User.find({
        _id: { 
            $ne: currentUserId,           // exclude current user
            $nin: currentUser.friend      // exclude current user's friends
        },
        isOnboarded: true,
        skills: { $in: currentUser.skills } // match users who have at least one skill in common
    }).select("fullName avatar location skills bio");

    if (recommendedUser.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No recommended users found"));
    }
    return res.status(200).json(new ApiResponse(200, recommendedUser, "Recommended users fetched successfully"));
});

const getMyFriends = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    if (!currentUserId) {
        throw new ApiError(404, "User not found");
    }
    const currentuser = await User.findById(currentUserId)
    .select("friends")// Include only the 'friends' field from User
    .populate("friends", "fullName avatar location skills bio"); // Populate 'friends' field and return only these subfields

   
    // const friends = currentuser.friends;

    // if (friends.length === 0) {
    //     return res.status(200).json(new ApiResponse("No friends found", []));
    // }

    return res.status(200).json(new ApiResponse(200, currentuser, "Friends fetched successfully"));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const recipientId = req.params.id;
    //prevent self friend request
    if (senderId === recipientId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    if (!recipientId) {
        throw new ApiError(400, "Recipient ID is required");
    }

    const recipient = await User.findById(recipientId);

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
     await request.save();
    }
    else{
        throw new ApiError(400,"No valid friend request");
    }

    return res.status(200).json(new ApiResponse(200,{},"Friend request rejected successfully"));
})

export { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest,
    getFriendRequests,getOutgoingFriendRequests, rejectFriendRequest};