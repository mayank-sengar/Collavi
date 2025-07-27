import React from 'react';
import { MapPin } from 'lucide-react';


const AcceptReqCard = ({ request, acceptFriendRequest,rejectFriendRequest, isPending }) => {
  const friend = request?.sender; // Extract sender info from request
  
  const generateInitialPfp = (name) => {
    const encodedName = encodeURIComponent(name || '');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&chars=2&radius=50`;
  };

  return (
    <div className="bg-gray-800 w-full rounded-3xl p-5 border border-gray-700 hover:border-emerald-500 transition-all duration-300 overflow-hidden">
      
      {/* Header with Avatar and Name */}
      <div className="flex items-center space-x-4 mb-4 flex-wrap min-w-0">
        <img
          src={friend?.avatar || generateInitialPfp(friend?.fullName)}
          alt={friend?.fullName || "User Avatar"}
          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 flex-shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = generateInitialPfp(friend?.fullName);
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">{friend?.fullName}</h3>
          {friend?.location && (
            <div className="flex items-center text-gray-400 text-sm mt-1 flex-wrap">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{friend?.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio Section */}
      {friend?.bio && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm break-words">{friend?.bio}</p>
        </div>
      )}

      {/* Skills Section */}
      {friend?.skills && friend.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {friend.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-600/30 hover:bg-emerald-600/30 break-words flex-shrink-0"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2 flex-wrap gap-2">
        <button
          onClick={() => acceptFriendRequest(request._id)}
          disabled={isPending}
          className="flex-1 min-w-[120px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium text-sm cursor-pointer whitespace-nowrap"
        >
          {isPending ? 'Accepting...' : 'Accept Request'}
        </button>
        <button
         onClick={()=> rejectFriendRequest(request._id)}
          disabled={isPending}
          className="flex-1 min-w-[120px] px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-medium text-sm cursor-pointer whitespace-nowrap"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AcceptReqCard;
