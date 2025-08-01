import React from 'react'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import signup4 from "../assets/signup4.png"
// import { useNavigate } from 'react-router-dom'
// import axiosInstance from '../utils/axiosInstance';
// import API_PATHS from '../utils/apiPaths';
// import { toast } from 'react-hot-toast';
// import { UserContext } from '../context/userContext.jsx';
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import {signup} from "../utils/apiPaths.js"


const SignUp = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const queryClient = useQueryClient();
  const { mutate:signUpMutation , isPending, error } = useMutation({
    mutationFn:signup,
    //on signup re-fetch the authenticated user
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
  });

  //normal context
  // const [error, setError] = useState(null);
  // const [isPending, setIsPending] = useState(false);
  // const navigate = useNavigate();
  // const { updateUser } = useContext(UserContext);

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
  //     setError("All Fields are required");
  //     return;
  //   }
  //   setIsPending(true);
  //   try {
  //     // Step 1: Register the user
  //     const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
  //       fullName: signUpData.fullName,
  //       email: signUpData.email,
  //       password: signUpData.password,
  //     });
      
  //     if (response.status === 201) {
  //       console.log("Signup successful:", response);
        
  //       // Step 2: Auto-login the user to get authentication tokens
  //       try {
  //         const loginResponse = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
  //           email: signUpData.email,
  //           password: signUpData.password,
  //         });
          
  //         console.log("Auto-login successful:", loginResponse);
          
  //         if (loginResponse.data && loginResponse.data.data && loginResponse.data.data.user) {
  //           // Update user context with authenticated user data
  //           updateUser(loginResponse.data.data.user);
            
  //           toast.success("Account created successfully!");
            
  //           // Navigate after a small delay to ensure context is updated
  //           setTimeout(() => {
  //             navigate("/onboarding");
  //           }, 100);
  //         }
  //       } catch (loginError) {
  //         console.error("Auto-login failed:", loginError);
  //         // Fall back to using the registration data
  //         if (response.data && response.data.data) {
  //           updateUser(response.data.data);
  //           toast.success("Signup successful!");
  //           navigate("/onboarding");
  //         }
  //       }
  //     } 
  //   } catch (error) {
  //     if (error?.response?.data?.message) {
  //       setError(error.response.data.message);  
  //     } else {
  //       console.error("Signup error:", error);
  //       setError("Something went wrong. Please try again");
  //     }
  //   } finally {
  //     setIsPending(false);
  //   }
  //   console.log('Signup data:', signUpData);
  // }

  const handleSignup = (e)=>{
    e.preventDefault();
    signUpMutation(signUpData);
  };




  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900">
      <div className="border border-green-400/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
           
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 tracking-wider">
              Collavi
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <span className="text-red-300">{error.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Create an Account</h2>
                  <p className="text-sm text-gray-300">
                    Join Collavi and learn with the community!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* FULLNAME */}
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-gray-300">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  {/* EMAIL */}
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-gray-300">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>
                  {/* PASSWORD */}
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-gray-300">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4  bg-gray-700 border border-gray-600 rounded focus:ring-green-400 focus:ring-2 text-green-600" 
                      required 
                    />
                    <span className="text-xs leading-tight text-gray-300">
                      I agree to the{" "}
                      <span className="text-green-400 hover:text-green-300 hover:underline cursor-pointer">terms of service</span> and{" "}
                      <span className="text-green-400 hover:text-green-300 hover:underline cursor-pointer">privacy policy</span>
                    </span>
                  </div>
                </div>

                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800" 
                  type="submit"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white
                       border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-400 hover:text-green-300 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-green-900/20 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative   mx-auto">           
              <img src={signup4} alt="Connection illustration" className="w-full h-full rounded-2xl object-cover" />
            </div>

            <div className="text-center ">
              <h2 className="text-xl font-semibold text-white">Connect with people who want to grow together worldwide</h2>
              <p className="text-gray-300">
                Learn skills , make friends, and work on  your communication  together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp