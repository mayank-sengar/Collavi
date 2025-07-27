import React from 'react'
import FriendCard from '../components/FriendCard'
import AcceptReqCard from '../components/AcceptReqCard'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { getOutgoingFriendRequests, acceptFriendRequest as acceptFriendRequestAPI, incommingFriendRequest, rejectFriendRequest} from '../utils/apiPaths'

const Notifications = () => {
  const queryClient = useQueryClient();

  const {data: outgoingFriendReqs} = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendRequests,
  });

  const {data: incommingFriendRequests} = useQuery({
    queryKey: ["incommingFriendReqs"],
    queryFn: incommingFriendRequest,
  })

  const {mutate: acceptFriendRequestMutation, isPending} = useMutation({
    mutationFn: acceptFriendRequestAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["outgoingFriendReqs"]});
      queryClient.invalidateQueries({queryKey: ["incommingFriendReqs"]});
      queryClient.invalidateQueries({queryKey: ["friends"]});
    },      
  });

  const {mutate: rejectFriendRequestMutation} = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["outgoingFriendReqs"]});
      queryClient.invalidateQueries({queryKey: ["incommingFriendReqs"]});
      queryClient.invalidateQueries({queryKey: ["friends"]});
    },      
  });



  return (
    <div className="bg-gray-900 min-h-screen p-6 ">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-2xl font-bold text-white mb-6">Friend Requests</h1>
        
        {/* Incoming Friend Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Incoming Requests</h2>
          {incommingFriendRequests?.data?.incommingRequest && incommingFriendRequests.data.incommingRequest.length > 0 ? (
            <div className="gap-4">
              {incommingFriendRequests.data.incommingRequest.map((request) => (
                <AcceptReqCard 
                  key={request._id} 
                  request={request}
                  acceptFriendRequest={acceptFriendRequestMutation} 
                  rejectFriendRequest={rejectFriendRequestMutation}
                  isPending={isPending}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No incoming friend requests</p>
          )}
        </div>

        {/* Outgoing Friend Requests */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Sent Requests</h2>
          {outgoingFriendReqs?.data && outgoingFriendReqs.data.length > 0 ? (
            <div className="grid gap-4">
              {outgoingFriendReqs.data.map((request) => (
                <div key={request._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <img
                      src={request.recipient?.avatar || '/default-avatar.png'}
                      alt={request.recipient?.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-medium">{request.recipient?.fullName}</h3>
                      <p className="text-gray-400 text-sm">Request sent</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-3 py-1 bg-yellow-700/30 text-yellow-400
                       rounded-full text-xs">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No sent requests</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications