import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import {Link,useLocation} from "react-router";
import { BellIcon, Home, HomeIcon } from 'lucide-react';
import { User } from 'lucide-react';
import { Bell } from 'lucide-react';

const Sidebar = () => {
    const {authUser} = useAuthUser();
    const currentPath = useLocation().pathname;
     const generateInitialPfp = (name) => {
    const encodedName = encodeURIComponent(name || '');
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&chars=2&radius=50`;
  };

  return (
    <aside className="w-64 bg-gray-800 border-r
     border-gray-700 hidden lg:flex flex-col h-screen sticky
     top-0">
      <Link to='/' className='p-4 flex justify-center'>
             <span  className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 tracking-wider">
              Collavi
            </span>
      </Link>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
        to='/'
        className={`px-4 py-3 rounded-lg flex items-center gap-3 w-full transition-colors duration-200 hover:bg-gray-700 
        ${currentPath == "/" ? "bg-emerald-600 text-white" : "text-gray-300 hover:text-white"}`}>
        <HomeIcon className="w-5 h-5" />
        <span>Home</span>
        </Link>

        <Link
        to='/friends'
        className={`px-4 py-3 rounded-lg flex items-center gap-3 w-full transition-colors duration-200 hover:bg-gray-700 
        ${currentPath == "/friends" ? "bg-emerald-600 text-white" : "text-gray-300 hover:text-white"}`}>
        <User className="w-5 h-5" />
        <span>Friends</span>
        </Link>

        <Link
        to='/notifications'
        className={`px-4 py-3 rounded-lg flex items-center gap-3 w-full transition-colors duration-200 hover:bg-gray-700 
        ${currentPath == "/notifications" ? "bg-emerald-600 text-white" : "text-gray-300 hover:text-white"}`}>
        <BellIcon className="w-5 h-5" />
        <span>Notifications</span>
        </Link>

        {/* User profile section */}

      </nav>
      
        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex flex-row justify-start items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full  flex-shrink-0 overflow-hidden">
              <img src={authUser?.avatar || generateInitialPfp(authUser?.fullName)} alt="Profile pic" className="w-full h-full object-cover"/>
            </div>
          </div>
          <div className="text-sm font-medium">
           {authUser?.fullName}
          </div>

          </div>
        </div>



    </aside>
  )
}

export default Sidebar