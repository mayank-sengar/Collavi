import React from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

const Layout = ({children,showSidebar=false}) => {
  return (
    <div className= "h-screen">
        <div className= "flex h-full">
            {showSidebar && <Sidebar/>}

            <div className ='flex-1 flex flex-col'>
            <Navbar/>
            <main className= " flex-1 overflow-y-auto ">
                {/* homepage,notifications,friends page  are children*/}
                {children}
            </main>

            </div>

        
        </div>
    </div>
  )
}

export default Layout