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




const SOCKET_URL="http://localhost:8001";

const Chats = () => {
  const  {authUser} = useAuthUser();
const socket = useRef(null);


  const navigate =useNavigate();
  const queryClient = useQueryClient();
  const handleExit = ()=>{
    navigate('/');
  }

  const { id: recipientId } = useParams();

  const [messageInput ,setMessageInput] = useState('');
  
  const {data: conversation = [],isLoading : loadingConversation } = useQuery({
    queryKey : ["conversation", recipientId],
    queryFn: () => getMessage(recipientId),
    enabled: !!recipientId
  })

  const {mutate : sendMessageMutation } = useMutation ( {
    mutationFn: (messageObj) => sendMessage(recipientId, messageObj),
    onSuccess :  () => queryClient.invalidateQueries({queryKey :  ["conversation", recipientId]})
  })



const { data: friendDetails, isLoading: loadingFriend } = useQuery({
  queryKey: ["friendDetails", recipientId],
  queryFn: () => getFriendDetails(recipientId),
  //query will only run if true
  enabled: !!recipientId
});

const handleSend= async()=>{

  if(!messageInput.trim()) return;

  socket.current.emit("sendMessage",{
    sender:authUser._id,
    recipient:recipientId,
    message: messageInput,
  })

  sendMessageMutation(messageInput);
  setMessageInput("");
}


useEffect (()=>{
  //useRef() returns an object like { current: null }.
  socket.current = io(SOCKET_URL,{
    withCredentials: true,
  })

  socket.current.on("connect",()=>{
    console.log("Connected to socket: ", socket.current.id);
    //join room 
     const roomId = [authUser._id, recipientId].sort().join("_");
    socket.current.emit("joinRoom", roomId);
  })

  socket.current.on("newMessage",(msg)=>{
    //refetch messages
    queryClient.invalidateQueries({queryKey:[conversation,recipientId]});
    console.log("New Message received ",msg);
  })

  return ()=>{
    socket.current.disconnect();
  }
}
,[recipientId,authUser._id])




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
              <button className='cursor-pointer'>
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
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.sender === recipientId
                    ? 'bg-gray-500 self-start'
                    : 'bg-green-700 text-white self-end ml-auto'
                }`}
              >
                {msg.message}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-gray-600">
              No conversations yet
            </div>
          )}
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