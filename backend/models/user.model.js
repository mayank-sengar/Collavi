import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,   
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
      type: String,
      required: true,
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "",
    },
    location: {
        type:String,
        default:""
    },
    skills:{
        type:[String],
        default:[],
    },
    isOnboarded:{
        type:Boolean,
        default:false,
    },
    friend:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]


},{
    timestamps: true,
})

//pre hook to hash password before saving
userSchema.pre("save", async function (next) {
    try{
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
    }
    catch (error) {
        console.error("Error hashing password:", error);
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};



 const User=mongoose.model("User", userSchema);

export default User;