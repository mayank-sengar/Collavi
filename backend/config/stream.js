import { StreamChat } from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY;
const apiSecret=process.env.STEAM_API_SECRET;


if(!apiKey || ! apiSecret){
    console.log("Stream API key or secret is missing")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

//upsert => if user exists "update" else "create" user
export const upsertStreamUser = async (userData) =>{
    try{
       streamClient.upsertUsers([userData]);
       return userData;
    }
    catch(err){
        console.error("Error in upserting Stream user", error);
    }
};

//todo
export const generateStreamToken = (userId)=>{
  try{
    if (!userId) {
      throw new Error("User ID is required for token generation");
    }
    const userIdString = userId.toString();
    console.log("Creating token for user ID:", userIdString);
    const token = streamClient.createToken(userIdString);
    console.log("Token created successfully");
    return token;
  }
  catch(error){
    console.error("Error generating Stream token:", error);
    throw error;
  }
};



