// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import useAuthUser from "../hooks/useAuthUser";
// import { useQuery } from "@tanstack/react-query";
// import { getStreamToken } from "../utils/apiPaths";

// import {
//   Channel,
//   ChannelHeader,
//   Chat,
//   MessageInput,
//   MessageList,
//   Thread,
//   Window,
// } from "stream-chat-react";
// import { StreamChat } from "stream-chat";
// import toast from "react-hot-toast";
// import PageLoader from "../components/PageLoader";
// import "stream-chat-react/dist/css/v2/index.css";
// const STEAM_API_KEY =import.meta.env.VITE_STEAM_API_KEY;
// const ChatPage = () => {
//   const {id: targetUserId} = useParams();
//   const [chatClient,setChatClient] = useState(null);
//   const [channel,setChannel]=useState(null);
//   const [loading,setLoading]=useState(true);

//   const {authUser} = useAuthUser();
  
//   const {data: tokenData, error: tokenError, isLoading: tokenLoading} = useQuery({
//     queryKey:["streamToken"],
//     queryFn:getStreamToken,
//     enabled:!!authUser //only run when authUser is available 
//   })

//   // Debug logging
//   console.log("Token data:", tokenData);
//   console.log("Token error:", tokenError);
//   console.log("Token loading:", tokenLoading);
  
//   useEffect(()=>{
//     const initChat = async()=>{
//      if(!authUser || !tokenData || !targetUserId) return;

//      try{
//       console.log("Initializing stream chat client");
//       console.log("Auth user:", authUser);
//       console.log("Token data:", tokenData);
//       console.log("Target user ID:", targetUserId);

//       // Access token from the nested structure
//       const token = tokenData?.data?.token || tokenData?.token;
//       if (!token) {
//         throw new Error("Stream token is missing");
//       }

//       const client = await StreamChat.getInstance(STEAM_API_KEY)
// console.log("client",client)
//       await client.connectUser(
//         {
//           id:authUser._id,
//           name:authUser.fullName,
//           image: authUser.avatar,
//         },
//         token  // Use the extracted token
//       );
      
// //whoever starts the chat from any side channelId remains the same as it will always be sorted and in same order
//       const channelId= [authUser._id,targetUserId].sort().join("-");

//       const currChannel =client.channel("messaging",channelId,{
//         members: [authUser._id,targetUserId],
//       })
//       console.log("channelid",channelId)
// //any changes
//       await currChannel.watch();

//       setChatClient(client);
//       setChannel(currChannel);

      
//      }
//      catch(error){
//           console.error("Error initializing chat:", error);
//         toast.error("Could not connect to chat. Please try again.");
//      }
//      finally{
//       setLoading(false);
//      }
//     }

//     initChat();
//   },[authUser,tokenData,targetUserId]);
  
// if (loading || !chatClient || !channel) return <PageLoader />;
//   return (
//     <div className="bg-gray-900 h-full w-full flex justify-center items-center p-8">
//       <div className="bg-amber-50 w-full h-full flex justify-center items-center rounded-lg">
//         <div className="text-black text-xl">
//            <div className="h-[93vh]">
//             <Chat client={chatClient} theme="messaging light">
//               <Channel channel={channel}>
//                 <div className="w-full relative">
//                   <Window>
//                     <ChannelHeader />
//                     <MessageList />
//                     <MessageInput focus />
//                   </Window>
//                 </div>
//                 <Thread />
//               </Channel>
//             </Chat>
//         </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatPage