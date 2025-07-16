import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getUserFriends, getRecommendedUsers, getOutgoingFriendRequests, sendFriendRequest } from '../utils/apiPaths';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserIcon } from 'lucide-react';
const HomePage = () => {
  const queryClient = useQueryClient();
  //to prevent sending friend requests to those users which have a pending friend request
  const [outgoingRequestsIds,setOutgoingRequestsIds] = useState([]);

  
  const {data:friend = [] ,isLoading :loadingFriends} = useQuery({
    queryKey:["friends"],
    queryFn : getUserFriends
  })

  const {data:recommendedUser = [] ,isLoading :loadingUsers} = useQuery({
    queryKey:["users"],
    queryFn : getRecommendedUsers
  })

  const {data:outgoingFriendReqs} = useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn : getOutgoingFriendRequests,
  })

  //to send friend request
  const {mutate : sendRequestMutation,isPending} = useMutation({
       mutationFn: sendFriendRequest,
       onSuccess: () => queryClient.invalidateQueries({queryKey : ["outgoingFriendReqs"]}),

  })   

  useEffect(() => {
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      const outgoingIds = outgoingFriendReqs.map((req) => req.id);
      setOutgoingRequestsIds(outgoingIds);
    } else {
      setOutgoingRequestsIds([]);
    }
  }, [outgoingFriendReqs])
  return (
    <>
  
    <div className="flex justify-between items-center p-4 ">
      <div className="font-bold text-2xl pl-8">
        Your Friends
      </div>
      
      <div className="">
       <Link to="/notifications" className="flex items-center p-2 rounded-full border-amber-100 border-2 gap-2">
         <UserIcon className="size-4"/> 
         <span>Friend Requests</span>
       </Link>
      </div>

    </div>
    </>
  )
}

export default HomePage
