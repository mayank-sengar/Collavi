import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getUserFriends, getRecommendedUsers, getOutgoingFriendRequests, sendFriendRequest } from '../utils/apiPaths';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserIcon } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import FriendCard from '../components/FriendCard';
import SendRequestCard from '../components/SendRequestCard';
import {Users} from 'lucide-react'
import { UsersIcon } from 'lucide-react';
const HomePage = () => {
  const queryClient = useQueryClient();
  //to prevent sending friend requests to those users which have a pending friend request
  const [outgoingRequestsIds,setOutgoingRequestsIds] = useState([]);

//response from backend is a object with friend array inside it   
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
       onError: (error) => {
         console.error("Friend request error:", error);
         console.error("Error response:", error?.response?.data);
         alert(error?.response?.data?.message || error?.message || "Failed to send friend request");
       }
  })   

  useEffect(() => {
    console.log("outgoingFriendReqs:", outgoingFriendReqs);
    if (outgoingFriendReqs?.data && outgoingFriendReqs.data.length > 0) {
      const outgoingIds = outgoingFriendReqs.data.map((req) => {
        console.log("Request object:", req);
        return req.recipient._id;
      });
      console.log("Mapped outgoing IDs:", outgoingIds);
      setOutgoingRequestsIds(outgoingIds);
    } else {
      setOutgoingRequestsIds([]);
    }
  }, [outgoingFriendReqs]);
  return (
    <>
  
    <div className="flex justify-between items-center p-4 ">
      <div className="font-bold text-2xl pl-8">
        Your Friends
      </div>
      
      <div className="">
       <Link to="/notifications" className="flex items-center p-2 rounded-full border-amber-100 border-2 gap-2">
         <UsersIcon className="size-4 "/> 
         <span>Friend Requests</span>
       </Link>
      </div>
    </div>

     {loadingFriends  ?  (
     <PageLoader/>
     ):(
      !friend?.data?.friend || friend?.data?.friend?.length === 0 ? (<p 
      className='text-center text-lg text-gray-500 mt-3 flex justify-center'>No Friends yet</p>) : 
      (
        <div className="flex flex-wrap gap-6 p-6 justify-center">
        {friend?.data?.friend?.map((frnd)=> (
          <div key={frnd._id}>
            <FriendCard friend={frnd} />
            </div>
        ))}
        </div>
      )
     )}    
     
     {/* <div className="flex flex-wrap gap-6 p-6 justify-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <FriendCard key={i} />
      ))}
    </div> */}

<div className="ml-12 ">
   <p className ='font-bold text-2xl'> Send Friend Request</p>
    <p className="text-sm font-sans">Meet new peers with same skills!</p>
</div>

{loadingUsers ? (
  <PageLoader />
) : recommendedUser?.data && recommendedUser?.data?.length > 0 ? (
  <div className="flex flex-wrap gap-6 p-6 justify-center">
    {recommendedUser?.data?.map((user) => (
      <SendRequestCard  
        key={user._id}
        friend={user}  
        outgoingFriendReqs={outgoingRequestsIds} 
        sendFriendRequest={() => sendRequestMutation(user._id)}
      />
    ))}
  </div>
) : (
  <div>
    <p className="text-center text-lg text-gray-500 mt-8">No recommended users found!</p>
  </div>
)}



    </>
  )
}

export default HomePage
