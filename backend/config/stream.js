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
    const userIdString = userId.toString();
    return streamClient.createToken(userIdString);

  }
  catch(error){
    console.error("Error generating Stream token:", error);
  }
};



