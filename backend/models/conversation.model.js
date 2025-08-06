import mongoose from "mongoose";
//to store previous conversation

const conversationSchema = mongoose.Schema({
    members:[
        {
        type:mongoose.Schema.ObjectId,
        ref:"User",
       }
    ],
    messages:[
        {
        type:mongoose.Schema.ObjectId,
        ref:"Message",
        }
    ]
});

const Conversation = mongoose.model("Conversation",conversationSchema);
export default Conversation;