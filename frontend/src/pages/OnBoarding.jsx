import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { onBoardUser } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { useState,useEffect} from 'react';
import ProfilePhotoSelector from '../components/ProfilePhotoSelector';
import CountriesList from '../components/CountriesList';
import SKILLS from '../data/skills';
const OnBoarding = () => {
  const {authUser} = useAuthUser();
  const [userDetails,setUserDetails] = useState({
    avatar : authUser?.avatar || "",
    bio : authUser?.bio || "",
    //on reload ok and cross were comming 
    skills: (authUser?.skills || []).filter(skill => skill && skill.toLowerCase() !== "ok"),
    location : authUser?.location || "",
    fullName: authUser?.fullName || "",
  })

 const queryClient = useQueryClient();
 const {mutate:onBoardMutation ,isPending,error } = useMutation({
  mutationFn : onBoardUser,
  onSuccess : () => {
    toast.success("Profile onboarded successfully");
    queryClient.invalidateQueries({ queryKey: ["authUser"] })

  }

 })

   const handleSubmit = (e)=>{
    e.preventDefault();
    onBoardMutation(userDetails);
  };

    const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // When image or preview changes, update userDetails.avatar
 useEffect(() => {
    if (image && preview) {
      setUserDetails((prev) => ({ ...prev, avatar: preview }));
    } else if (!image) {
      setUserDetails((prev) => ({ ...prev, avatar: "" }));
    }
  }, [image, preview]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-4">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-2">
            {/* PROFILE PIC CONTAINER */}
          <div className="flex flex-col items-center space-y-1">
          
              <ProfilePhotoSelector
                image={image}
                setImage={setImage}
                preview={preview}
                setPreview={setPreview}
              />
            
            </div>

            {/* FULL NAME */}
          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
              value={userDetails.fullName || ''}
              onChange={e => setUserDetails({ ...userDetails, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                placeholder="Your full name"
              required
              />
            </div>

            {/* BIO */}
          <div>
            <label className="block text-gray-300 mb-1">Bio</label>
              <textarea
                name="bio"
                value={userDetails.bio}
              onChange={e => setUserDetails({ ...userDetails, bio: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400 h-24"
                placeholder="Tell others about yourself and your language learning goals"
              required
              />
            </div>

          {/* SKILLS TAG INPUT */}
          <div>
            <label className="block text-gray-300 mb-1">Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userDetails.skillInput || ""}
                onChange={e => setUserDetails({ ...userDetails, skillInput: e.target.value })}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',') && userDetails.skillInput) {
                    e.preventDefault();
                    const skill = userDetails.skillInput.trim();
                    if (!skill) return;
                    if (!userDetails.skills.includes(skill)) {
                      setUserDetails({
                        ...userDetails,
                        skills: [...userDetails.skills, skill],
                        skillInput: ""
                      });
                    } else {
                      setUserDetails({ ...userDetails, skillInput: "" });
                    }
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
              />
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  if (userDetails.skillInput) {
                    const skill = userDetails.skillInput.trim();
                    if (!skill) return;
                    if (!userDetails.skills.includes(skill)) {
                      setUserDetails({
                        ...userDetails,
                        skills: [...userDetails.skills, skill],
                        skillInput: ""
                      });
                    } else {
                      setUserDetails({ ...userDetails, skillInput: "" });
                    }
                  }
                }}
                disabled={!userDetails.skillInput}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
             
              {userDetails.skills.map(skill => (
                <span key={skill} className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                  {skill}
                  <button
                    type="button"
                    className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                    onClick={() => setUserDetails({
                      ...userDetails,
                      skills: userDetails.skills.filter(s => s !== skill)
                    })}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Type a skill and press Enter or Add. Skills are normalized and shown as tags below.</p>
          </div>

            {/* LOCATION */}
          <div>
            <label className="block text-gray-300 mb-1">Location</label>
            <CountriesList
             userDetails={userDetails}
             setUserDetails={setUserDetails}
            />
            </div>

            {/* SUBMIT BUTTON */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 mb-2 text-red-300 text-center">
              {error.message || 'An error occurred while onboarding.'}
            </div>
          )}
          <button
            className="w-full bg-green-600 hover:bg-green-700
             text-white font-medium py-2 px-4 rounded-md transition-colors 
             duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 
             focus:ring-offset-2 focus:ring-offset-gray-800 mt-4"
            disabled={isPending}
            type="submit"
          >
            {isPending ? 'Onboarding...' : 'Complete Onboarding'}
          </button>
          </form>
        </div>
      </div>
    
  )
}

export default OnBoarding