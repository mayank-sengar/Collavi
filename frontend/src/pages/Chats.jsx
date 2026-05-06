import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { getMessage,sendMessage,getFriendDetails } from '../utils/apiPaths';
import { VideoIcon } from 'lucide-react';
import { Send } from 'lucide-react';
import { useEffect,useRef } from 'react';
import {io} from 'socket.io-client';
import useAuthUser from './../hooks/useAuthUser';




const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const Chats = () => {
  const  {authUser} = useAuthUser();
  //Ref used so that socket is not reinitialized by the rerenders caused due to messages and conversations 
const socket = useRef(null);
const messagesEndRef = useRef(null);


  const navigate =useNavigate();
  const queryClient = useQueryClient();
  const handleExit = ()=>{
    navigate('/');
  }

  const { id: recipientId } = useParams();

  const [messageInput ,setMessageInput] = useState('');
  const [callId, setCallId] = useState(null);
  
  const {data: conversation = [],isLoading : loadingConversation } = useQuery({
    queryKey : ["conversation", recipientId],
    queryFn: () => getMessage(recipientId),
    enabled: !!recipientId
  })

  const {mutate : sendMessageMutation } = useMutation ( {
    mutationFn: (messageObj) => sendMessage(recipientId, messageObj),
    onError :  () => queryClient.invalidateQueries({queryKey :  ["conversation", recipientId]})
  })



const { data: friendDetails, isLoading: loadingFriend } = useQuery({
  queryKey: ["friendDetails", recipientId],
  queryFn: () => getFriendDetails(recipientId),
  //query will only run if true
  enabled: !!recipientId
});

//handle when message is to be sent 
const handleSend= async()=>{

  if(!messageInput.trim() || !authUser?._id || !recipientId) return;

  const roomId = [authUser._id, recipientId].sort().join("_");
  const clientMsgId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const text = messageInput;
  const createdAt = new Date().toISOString();

  // Optimistically render message immediately for sender
  queryClient.setQueryData(["conversation", recipientId], (oldData) => {
    const prev = oldData?.data || [];
    return {
      ...(oldData || {}),
      data: [
        ...prev,
        {
          clientMsgId,
          sender: authUser._id,
          recipient: recipientId,
          message: text,
          createdAt,
        },
      ],
    };
  });

  // Persist first; backend emits realtime to room after save
  sendMessageMutation({ message: text, clientMsgId, roomId });
  setMessageInput("");
}




// Initialize socket connection once on mount
useEffect(() => {
  if (socket.current) return; // Already initialized

  socket.current = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socket.current.on("connect", () => {
    console.log("Socket connected");
  });

  socket.current.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.current.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };
}, []);

// Set up newMessage listener
useEffect(() => {
  if (!socket.current) return;

  // Remove previous listener to avoid stacking
  socket.current.off("newMessage");

  const handleNewMessage = (msg) => {
    // Append instantly; avoid network refetch delay for every message
    queryClient.setQueryData(["conversation", recipientId], (oldData) => {
      const prev = oldData?.data || [];

      // Only append messages from this chat
      const isSameChat =
        (msg.sender === authUser._id && msg.recipient === recipientId) ||
        (msg.sender === recipientId && msg.recipient === authUser._id);

      if (!isSameChat) return oldData;

      // Prevent duplicates (echo + optimistic update)
      const exists = prev.some((m) => m.clientMsgId && m.clientMsgId === msg.clientMsgId);
      if (exists) {
        const updated = prev.map((m) =>
          m.clientMsgId === msg.clientMsgId ? { ...m, ...msg } : m
        );
        return {
          ...(oldData || {}),
          data: updated,
        };
      }

      return {
        ...(oldData || {}),
        data: [...prev, msg],
      };
    });
  };

  socket.current.on("newMessage", handleNewMessage);

  return () => {
    socket.current?.off("newMessage", handleNewMessage);
  };
}, [recipientId, authUser?._id, queryClient]);

// Handle room join when chat partner changes
useEffect(() => {
  if (!authUser?._id || !recipientId || !socket.current) return;

  const roomId = [authUser._id, recipientId].sort().join("_");
  setCallId(roomId);

  if (socket.current.connected) {
    socket.current.emit("joinRoom", roomId);
  } else {
    const onConnect = () => {
      socket.current.emit("joinRoom", roomId);
      socket.current.off("connect", onConnect);
    };
    socket.current.on("connect", onConnect);
  }

  return () => {
    socket.current?.emit("leaveRoom", roomId);
  };
}, [recipientId, authUser?._id])

// Auto-scroll to bottom when messages change
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [conversation?.data]);


  return (
    <div>
         <div className="min-h-screen bg-blue-1000 p-4 md:p-6 ">
         <button className="cursor-pointer" onClick={handleExit}>
      <div className="flex text-xl ">   
      <ArrowLeft className='size-7'/>
      <span>Exit</span>
      </div>
      </button>
      
      <div className=' bg-amber-50 flex flex-col h-[80vh] mx-20 my-3 rounded-t-3xl rounded-b-2xl'>
        <div className='bg-black h-18 w-full flex  items-start rounded-t-2xl ' >
      
           {loadingFriend ? "Loading..." :
           <div className="flex flex-row p-2 ml-5 items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img src={friendDetails?.data?.avatar} alt="Friend's profile pic" className="h-13 w-13 rounded-full" />
              <div className='p-3 text-2xl font-semibold '>
                {friendDetails?.data?.fullName || "Friend"}
              </div>
            </div>

            <div className="flex items-center justify-center mr-20 text-green-600
             bg-green-300 rounded-3xl h-8 w-12 cursor-pointer">
              <button className='cursor-pointer' onClick={()=>{
                navigate(`/call/${callId}`,{
                 state: { friendName: friendDetails?.data?.fullName || "Friend" } 
                })
              }}>
                <VideoIcon/>
              </button>
            </div>
          </div>}
            
        </div>
{/*Conversations  */}
         
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingConversation ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : conversation?.data?.length > 0 ? (
            conversation?.data?.map((msg, idx) => (
              <div key={idx} className={msg.sender === recipientId ? "self-start" : "self-end ml-auto text-right"}>
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.sender === recipientId
                      ? 'bg-gray-500 self-start'
                      : 'bg-green-700 text-white self-end ml-auto'
                  }`}
                >
                  {msg.message}
                </div>
                {msg.createdAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-gray-600">
              No conversations yet
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

              
       
        {/*Message input */}
        <div  className='flex items-center gap-2 p-3   '>
          <input
          type="text"
          value={messageInput}
          onChange= {(e)=> {setMessageInput(e.target.value)} }
          onKeyDown={(e)=>{ e.key=='Enter' ? handleSend(): null}}
          placeholder='Type a Message'
          className='w-full h-10 bg-gray-400 rounded-xl p-2'
          />
          <button
            onClick={handleSend}
            className="p-2 bg-green-500 text-white rounded-lg cursor-pointer"
          >
            <Send />
          </button>

        </div>
      </div>
    </div>

 

    </div>

   
  )
}

export default Chats