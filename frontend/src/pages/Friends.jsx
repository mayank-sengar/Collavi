import React from 'react'
import { getUserFriends } from '../utils/apiPaths';
import {  useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom';
const Friends = () => {
    
    const {data:userFriend=[]} = useQuery({
        queryKey:["userFriends"],
        queryFn: getUserFriends,
    }
    );
  // console.log(userFriend);
  const friends = userFriend?.data?.friend || [];

   
    
  return (
    <>
    <h1 className='text-2xl font-bold p-6 ml-5'>Your Friends</h1>
      {friends?.length > 0  ?  
      (
      friends?.map((friend)=>
        (
        <div key={friend._id}
        className='max-w-screen bg-gray-800 border border-gray-700 hover:border-emerald-500  h-25 mx-10 my-5 
        flex flex-row  items-center
         rounded-xl '
        >
          <img src ={friend.avatar} alt='user pfp' 
          className='h-20 w-20 rounded-full ml-3 border
           border-gray-800 hover:border-emerald-500' />
           <div className="ml-3 font-semibold text-l">
            {friend.fullName}
           </div>

         
           {friend?.skills && friend.skills.length > 0 && (
        <div className="ml-4">
          <div className="flex flex-wrap gap-2">
            {friend.skills.map((skill, index) => (
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
           
          
         
         <div className='ml-auto'>
          <Link to={`/chat/${friend?._id}`} >
          <button className="bg-green-400 p-3 rounded-xl mr-6 cursor-pointer">
            Message
          </button>
           </Link>
         </div>
        
        </div>
        )
      ) 
     )
      : <div>Add Friends</div> }
    </>
  )
}

export default Friends