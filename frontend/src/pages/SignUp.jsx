import React from 'react'
import { useState } from 'react'
const SignUp = () => {
  const [signUpdata,setSignUpdata] = useState({
    fullName: "",
    email:"",
    password:""
  });

  const handleSignup = (e)=>{
    e.preventDefault();
  }
  return (
     
    <div  className=" h-screen flex items-center justify-center
     p-4 sm:p-6 md:p-8 bg-base-100">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100
      rounded-xl shadow-lg overflow-hidden'>
      
      {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
           
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Collavi
            </span>
          </div>
      </div>
      SignUp
    </div>
    </div>

  )
}

export default SignUp