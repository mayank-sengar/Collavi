import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
const FriendCard = ({friend}) => {
    const {authUser} = useAuthUser();
  return (
    <div className="bg-gray-800 w-90 flex-shrink-0 rounded-3xl p-5 border border-gray-700 hover:border-emerald-500 transition-all duration-300 overflow-hidden">
      {/* Header with Avatar and Name */}
      <div className="flex items-center space-x-4 mb-4 flex-wrap min-w-0">
        
          <img 
            src={authUser?.avatar}  
            alt="friend's avatar" 
            className='w-16 h-16 rounded-full object-cover border-2 border-emerald-500 flex-shrink-0'
          />
          
    
        <div className="flex-1 min-w-0">
          <h3 className='font-semibold text-lg text-white truncate'>{authUser?.fullName}</h3>
          {authUser?.location && (
            <div className="flex items-center text-gray-400 text-sm mt-1 flex-wrap">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{authUser?.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio Section
      {authUser?.bio && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm break-words">
            {authUser?.bio}
          </p>
        </div>
      )} */}

      {/* Skills Section */}
      {authUser?.skills && authUser.skills.length > 0 && (
        <div className="mb-4">
          {/* <div className="flex items-center text-gray-400 text-xs mb-2 flex-wrap">
            
            <span className="whitespace-nowrap">SKILLS</span>
          </div> */}
          <div className="flex flex-wrap gap-2">
            {authUser.skills.map((skill, index) => (
              <span 
                key={`${skill}-${index}`} 
                className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-600/30
                 hover:bg-emerald-600/30 break-words flex-shrink-0"
              >
                {skill}
              </span>
            ))}
            
          </div>
        </div>
      )}

      {/* Action Buttons */}
       <Link to={`/chat/${friend?._id}`}>
      <div className="flex space-x-2 pt-2 flex-wrap gap-2">
        <button className="flex-1 min-w-[120px] px-4 py-2 bg-emerald-600
         hover:bg-emerald-700 text-white rounded-lg 
         font-medium text-sm cursor-pointer whitespace-nowrap">
          Message
      </button>          
      </div>
      </Link>
     
      
      
    </div>

  )
}

export default FriendCard