import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import {Link,useLocation} from "react-router";
import { BellIcon, Home, HomeIcon } from 'lucide-react';
import { User } from 'lucide-react';
import { Bell } from 'lucide-react';

const Sidebar = () => {
    const {authUser} = useAuthUser();
    const currentPath = useLocation().pathname;
  return (
    <aside className="w-64 bg-base-200 border-r
     border-base-300  lg:flex flex-col h-screen sticky
     top-0">
      <Link to='/' className='p-4 flex justify-center'>
             <span  className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 tracking-wider">
              Collavi
            </span>
      </Link>
      <nav className="flex-1  space-y-3  ">
        <Link
        to='/'
        className={`btn btn-ghost justify-start w-full gap-3
        px-3  ${currentPath == "/" ? "btn-active" : ""}`}>
        <HomeIcon className="" />
        <span>Home</span>
        </Link>

        <Link
        to='/friends'
        className={`btn btn-ghost justify-start w-full gap-3
        px-3  ${currentPath == "/friends" ? "btn-active" : ""}`}>
        <User className="" />
        <span>Friend</span>
        </Link>

        <Link
        to='/notifications'
        className={`btn btn-ghost justify-start w-full gap-3
        px-3  ${currentPath == "/notifications" ? "btn-active" : ""}`}>
        <BellIcon className="" />
        <span>Notifications</span>
        </Link>

        {/* User profile section */}

      </nav>
      
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex flex-row justify-start items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={authUser?.avatar || "/default-avatar.png"} alt="Profile pic" className="w-full h-full object-cover"/>
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