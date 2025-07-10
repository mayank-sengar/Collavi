import React from 'react'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import signup4 from "../assets/signup4.png"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { UserContext } from '../context/userContext.jsx';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginData.email || !loginData.password) {
      setError("All Fields are required");
      return;
    }
    setIsPending(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: loginData.email,
        password: loginData.password,
      });
      
      console.log("Login response:", response);
      
      // Login typically returns 200, not 201
      if (response.status === 200) {
        // Extract user data from response
        if (response.data && response.data.data && response.data.data.user) {
          // Update user context with the user data
          updateUser(response.data.data.user);
          toast.success("Login successful!");
          console.log("Login successful, navigating to homepage");
          
          // Add a small delay to ensure context is updated
          setTimeout(() => {
            navigate("/");
          }, 100);
        } else {
          console.error("Invalid response format:", response);
          setError("Login successful but user data is missing");
        }
      } else {
        console.warn("Unexpected status code:", response.status);
        setError("Unexpected response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    } finally {
      setIsPending(false);
    }
  }
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
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Sign In</h2>
                  <p className="text-sm text-gray-300">
                    Join Collavi and learn with the community!
                  </p>
                </div>

                <div className="space-y-3">
                  
                  {/* EMAIL */}
                  <div className="w-full mb-6">
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-gray-300">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    
                  </div>

                  <div className="flex  gap-2 items-center ">
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white
                   font-medium py-2 px-4 rounded-md transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-green-400 
                    focus:ring-offset-2 focus:ring-offset-gray-800 mt-5 " 
                  type="submit"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-whit
                      e border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-400 hover:text-green-300 hover:underline">
                      Sign Up
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

export default Login