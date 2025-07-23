import React from 'react'

import useAuthUser from './../hooks/useAuthUser';
import { useLocation,Link, useNavigate } from 'react-router-dom';
import Notifications from './../pages/Notifications';
import { BellIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../utils/apiPaths';
const Navbar = () => {
    const generateInitialPfp = (name) => {
    const encodedName = encodeURIComponent(name || '');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&chars=2&radius=50`;
  };
  const {authUser} = useAuthUser();
  const currentPath = useLocation().pathname;
  // console.log(currentPath);
  const isChatPage = currentPath.startsWith("/chat/");
  // console.log(isChatPage);
  const navigate = useNavigate();

  const queryClient =useQueryClient();

   const { mutate:handleLogout  } = useMutation({
      mutationFn:logout ,
      //on logout success, clear auth user and navigate to login
      onSuccess: () => {
        // Clear the auth user immediately
        queryClient.setQueryData(["authUser"], null);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate('/login');
      }
    });
  


  return (
    <>
 
    <nav className="bg-black py-3 flex justify-between items-center px-4">
       <div className="flex items-center gap-2">
              {isChatPage &&
              <Link to="/">
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent 
            bg-gradient-to-r from-green-400 to-emerald-500 tracking-wider">
              Collavi
            </span>
            </Link>
         }
          
       </div>
           
       <div className="flex items-center  gap-3">
          <Link to="/notifications">
          <button>
          <BellIcon className='mt-3 cursor-pointer'/>
          </button>
          </Link>
            
            <div className="w-10 h-10 rounded-full overflow-hidden">
           <img src={authUser?.avatar || generateInitialPfp(authUser?.fullName)} alt="Profile pic" className="w-full h-full object-cover"/>
           </div>

           <button onClick={handleLogout} className="cursor-pointer">
            <LogOut />
          </button>


       </div>
        

          
    </nav>

  
    
    </>
    
  )
}

export default Navbar;