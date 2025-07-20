
import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import signup4 from "../assets/signup4.png";
import { toast } from 'react-hot-toast';
import {login} from '../utils/apiPaths.js'
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const queryClient = useQueryClient();
  const {mutate:loginMutation , isPending,error} = useMutation ({
    mutationFn : login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // You might want to redirect here based on user onboarding status
      // if (data.user?.isOnboarded) {
      //   navigate('/home');
      // } else {
      //   navigate('/onboard');
      // }
    },
    onError: (error) => {
      console.log("Login error:", error.response?.data?.message || error.message);
    }
  })


  const handleLogin = async (e) => {
    e.preventDefault();
   loginMutation(loginData);
  };


  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-900">
      <div className="border border-green-400/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM - LEFT SIDE */}
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
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-300">{error?.message || error?.response?.data?.message || 'An error occurred'}</span>
              </div>
              {/* Show help text for specific errors */}
              {(error?.message || error?.response?.data?.message || '').toLowerCase().includes("not registered") && (
                <div className="mt-2 text-xs text-red-300/80 pl-7">
                  <Link to="/signup" className="text-red-300 underline hover:text-red-200">
                    Create a new account instead
                  </Link>
                </div>
              )}
              {(error?.message || error?.response?.data?.message || '').toLowerCase().includes("incorrect password") && (
                <div className="mt-2 text-xs text-red-300/80 pl-7">
                  Forgot your password? Contact support.
                </div>
              )}
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
                </div>

                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 mt-5"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-400 hover:text-green-300 hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ILLUSTRATION - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-green-900/20 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative mx-auto">
              <img src={signup4} alt="Connection illustration" className="w-full h-full rounded-2xl object-cover" />
            </div>
            <div className="text-center ">
              <h2 className="text-xl font-semibold text-white">Connect with people who want to grow together worldwide</h2>
              <p className="text-gray-300">
                Learn skills, make friends, and work on your communication together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;