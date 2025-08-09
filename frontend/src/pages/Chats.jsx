import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { getMessage,sendMessage,getFriendDetails } from '../utils/apiPaths';
import Conversation from './../../../backend/models/conversation.model';
const Chats = () => {
  const navigate =useNavigate();
  const queryClient = useQueryClient();
  const handleExit = ()=>{
    navigate('/');
  }

  const { id: recipientId } = useParams();

  const [messageInput ,setMessageInput] = useState('');
  const [conversationMsg,setConversationMsg] = useState([]);
  
  const {data: conversation = [],isLoading : loadingConversation } = useQuery({
    queryKey : ["conversation", recipientId],
    queryFn: () => getMessage(recipientId),
    enabled: !!recipientId
  })

  const {mutate : sendMessageMutation } = useMutation ( {
    mutationFn: (messageText) => sendMessage(recipientId, messageText),
    onSuccess :  () => queryClient.invalidateQueries({queryKey :  ["conversation", recipientId]})
  })



const { data: friendDetails, isLoading: loadingFriend } = useQuery({
  queryKey: ["friendDetails", recipientId],
  queryFn: () => getFriendDetails(recipientId),
  enabled: !!recipientId
});




  return (
    <div>
         <div className="min-h-screen bg-blue-1000 p-4 md:p-6 ">
         <button className="cursor-pointer" onClick={handleExit}>
      <div className="flex text-xl ">   
      <ArrowLeft className='size-7'/>
      <span>Exit</span>
      </div>
      </button>
      
      <div className=' bg-amber-50 min-h-[80vh] mx-5 my-3  rounded-t-3xl rounded-b-2xl '>
        <div className='bg-black h-18 w-ful flex justify-start items-start rounded-t-2xl' >
         <div>
            {loadingFriend
              ? "Loading..."
              : friendDetails?.data?.fullName || "Friend"}
         </div>
        </div>
      </div>
    </div>

 

    </div>

   
  )
}

export default Chats