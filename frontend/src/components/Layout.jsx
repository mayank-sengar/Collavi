import React from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

const Layout = ({children,showSidebar=false}) => {
  return (
    <div className= "min-h-screen">
        <div className= "flex">
            {showSidebar && <Sidebar/>}

            <div className ='flex-1 flex flex-col'>
            <Navbar/>
            <main className= "flex-1 overflow-y-auto">
                {/* homepage  is children*/}
                {children}
            </main>

            </div>

        
        </div>
    </div>
  )
}

export default Layout