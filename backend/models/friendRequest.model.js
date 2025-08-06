import mongoose from "mongoose";
import User from './user.model.js'
const friendSchema = new mongoose.Schema({
    sender: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },  

    recipient: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User", 
        required: true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }
},{
    timestamps: true
}
);

const FriendRequest = mongoose.model("FriendRequest", friendSchema);
export default FriendRequest;

        