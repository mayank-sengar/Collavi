import React from 'react'
import { LoaderIcon } from 'lucide-react'


const PageLoader = () => {
  return (
    <div className = "min-h-screen flex items-center justify-center  ">
   <LoaderIcon className="animate-spin w-12 h-12 text-green-800" />
    </div>
  )
}

export default PageLoader