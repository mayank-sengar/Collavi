import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { generateStreamToken } from "../config/stream.js";
import Message from "../models/message.model.js";
import Conversation from "./../models/conversation.model.js";
import User from "../models/user.model.js";

// export const getStreamToken = asyncHandler(async (req, res) => {
//     try {
//         console.log("Generating stream token for user:", req.user._id);
//         const token = generateStreamToken(req.user._id);
//         console.log("Generated token:", token);
//         return res.status(200).json(new ApiResponse(200, { token }, "Stream token generated successfully"));
//     } catch (error) {
//         console.error("Stream token generation error:", error);
//         throw new ApiError(500, error.message || "Internal Server Error");
//     }
// });


const sendMessage = asyncHandler(async(req,res)=>{
const senderId=req.user._id;
const recipientId  = req.params.id;

const message = req.body.message;
 
let conversation = await Conversation.findOne({
    members : {
        $all : [senderId,recipientId]
    }
});

if(!conversation){
    conversation = await Conversation.create(
        {
            members:[senderId,recipientId],
            messages: []
        }
    )
}

const newMessage = await Message.create({
    sender:senderId,
    recipient:recipientId,
    message,
});

if(newMessage){
    conversation.messages.push(newMessage._id);
}

//2 promises and both run parallely 
await Promise.all([conversation.save(),newMessage.save()]);

return res.status(200).json(new ApiResponse(200, newMessage, "Message Sent Successfully"));

 });

const getMessage=asyncHandler(async(req,res)=>{
   const senderId=req.user._id;
   const recipientId  = req.params.id;

   let conversation = await Conversation.findOne({
    members:{
        $all: [senderId,recipientId],
    }
   }).populate("messages");

   if(!conversation){
    return res.status(200).json(new ApiResponse(200, [], "No conversation found"));
   }

   const messages = conversation.messages;

   return res.status(200).json(new ApiResponse(200, messages, "Conversation successfully loaded"));

});


const getFriendById = asyncHandler ( async (req,res)=>{
      const friendId= req.params.id;
      if(!friendId){
        throw new ApiError(400, "User ID is required");
      }
      const friend = await User.findById(friendId).select("-password -refreshToken");
      if(!friend){
        throw new ApiError(404, "User not found");
      }
      return res.status(200).json(new ApiResponse(200, friend, "User details fetched successfully"));
})


export  {sendMessage,getMessage,getFriendById};



