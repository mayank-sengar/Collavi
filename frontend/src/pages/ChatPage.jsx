import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../utils/apiPaths";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import "stream-chat-react/dist/css/v2/index.css";
import { ArrowLeft } from "lucide-react";
import { VideoIcon } from "lucide-react";

const STEAM_API_KEY =import.meta.env.VITE_STEAM_API_KEY;
const ChatPage = () => {
  const {id: targetUserId} = useParams();
  const [chatClient,setChatClient] = useState(null);
  const [channel,setChannel]=useState(null);
  const [loading,setLoading]=useState(true);

  const {authUser} = useAuthUser();
  const navigate=useNavigate();
  
  const {data: tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled:!!authUser //only run when authUser is available 
  })

 
  
  useEffect(()=>{
    const initChat = async()=>{
     if(!authUser || !tokenData || !targetUserId) return;

     try{
   

      // Access token from the nested structure
      const token = tokenData?.data?.token || tokenData?.token;
      if (!token) {
        throw new Error("Stream token is missing");
      }

      const client = await StreamChat.getInstance(STEAM_API_KEY)
console.log("client",client)
      await client.connectUser(
        {
          id:authUser._id,
          name:authUser.fullName,
          image: authUser.avatar,
        },
        token  // Use the extracted token
      );
      
//whoever starts the chat from any side channelId remains the same as it will always be sorted and in same order
      const channelId= [authUser._id,targetUserId].sort().join("-");

      const currChannel =client.channel("messaging",channelId,{
        members: [authUser._id,targetUserId],
      })
   
//any changes
      await currChannel.watch();

      setChatClient(client);
      setChannel(currChannel);

      
     }
     catch(error){
          console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
     }
     finally{
      setLoading(false);
     }
    }

    initChat();
  },[authUser,tokenData,targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleExit = async()=>{
     navigate('/')
  }
  
if (loading || !chatClient || !channel) return <PageLoader />;
  return (
    <div className="min-h-screen bg-blue-1000 p-4 md:p-6 ">
      <button className="cursor-pointer" onClick={handleExit}>
      <div className="flex text-xl ">   
      <ArrowLeft className='size-7'/>
      <span>Exit</span>
      </div>
      </button>
      <div className="max-w-7xl mx-auto h-full bg-blue-950 rounded-lg shadow-lg overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
          
             <div className="p-3  border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
              <button onClick={handleVideoCall} className=" mr-5   text-white bg-green-700 px-4 py-1 rounded-full cursor-pointer">
                 <VideoIcon className="size-6" />
               </button>
             </div>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  )
}

export default ChatPage