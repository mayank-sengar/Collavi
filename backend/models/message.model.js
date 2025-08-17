import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
    sender:{
     type:mongoose.Schema.ObjectId,
     ref:"User",
     required:true,
    },
    recipient:{
      type:mongoose.Schema.ObjectId,
      ref:"User",
      required:true,
    },
    message:{
        type:String,
        required:true,
    }
}
,
    {
        timestamps:true,
    })

const Message = mongoose.model("Message",messageSchema);
export default Message;