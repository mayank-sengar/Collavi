import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upsertStreamUser } from "../config/stream.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already registered");
    }

    

    const user = await User.create({
        fullName,
        email,
        password,
      
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Generate tokens after successful registration
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    //create here 
    try{
    await upsertStreamUser({
        id:createdUser._id.toString(),
        name: createdUser.fullName,
        image:createdUser.avatar || "",       
    });
    console.log(`Stream user created for ${createdUser.fullName}`);
    }
    catch(error){
        console.log("Error creating Stream user:", error);
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(409, "Email and Password fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "Email id not registered");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid) {
        throw new ApiError(400, "Incorrect Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});



const refreshAccessToken = asyncHandler(async (req, res) => {
    //taking refresh token from cookies 
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        //verify the token 
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const logoutUser = asyncHandler(async(req,res)=>{
  
    const user= req.user;

    if(!user){
        throw new ApiError(401, "unauthorized request");
    }
    await User.findByIdAndUpdate(user._id,
        {
           $unset:{
            refreshToken: 1
           }
        },{
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true,
        sameSite: 'None',
    }

    res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200,{},"User logged Out"))


})

//onboarding 
const onBoardUser = asyncHandler( async (req,res)=>{
const userId= req.user._id;

//handling skill array 
let skills = req.body['skills[]'] || req.body.skills || [];
// skills comes as a single string, convert to array
if (typeof skills === 'string') {
    skills = [skills];
}

const {fullName,bio,location} = req.body;

console.log("Received data:", { fullName, bio, skills, location }); 

if(!fullName || !bio || !skills.length || !location){
    return res.status(400).json({
        message: "All fields are required",
        missingFields:[
            !fullName && "fullName not present",
            !bio && "bio not present",
            !skills.length && "skills not present",
            !location && "location not present"
        ].filter(Boolean),
    });
}
 

let avatarUrl = "";
if (req.file && req.file.path) {
    console.log("File received:", req.file); // Debug log
    try {
        const avatar = await uploadOnCloudinary(req.file.path);
        if (!avatar) {
            console.log("Cloudinary upload failed - no response"); // Debug log
            return res.status(400).json({ message: "Profile picture upload failed - Cloudinary error" });
        }
        if (avatar && avatar.url) {
            avatarUrl = avatar.url;
            console.log("Avatar uploaded successfully:", avatarUrl); // Debug log
        }
    } catch (error) {
        console.error("Avatar upload error:", error); // Debug log
        return res.status(400).json({ message: "Profile picture upload failed - " + error.message });
    }
} else {
    console.log("No file received - avatar is required"); // Debug log
    return res.status(400).json({ message: "Profile picture is required" });
}

const updatedUser = await User.findByIdAndUpdate(userId,{
    fullName,
    bio,
    skills,
    location,
    isOnboarded:true,
    ...(avatarUrl && { avatar: avatarUrl }),
},{new : true})


if(!updatedUser) return res.status(404).json({message:"User not found"});

// update the user info stream 

return res.status(200).json({
    message: "User onboarded successfully",
    user: updatedUser
});


});

//without utils
// const userDetails = async (req,res)=>{
//     try{
//      const user= req.user;
//      if(!user){
//         return res.status(400).json({message: "User not authenticated"});
//      }
     
//      return res.status(200).json({
//         user,
//      })

//     }
//     catch(error){
//      return res.status(500).status()
//     }
// }

const userDetails = asyncHandler(  async(req,res)=>{
    const user = req.user;
    if(!user){
        return res.status(400).json(new ApiResponse(400,{},"User not authenticated"));
     }
     return res.status(200).json({
        user
     })
}
)


export { registerUser, loginUser, refreshAccessToken,logoutUser ,onBoardUser,userDetails};