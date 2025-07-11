import React from 'react'
import {LuUser ,LuUpload ,LuTrash} from "react-icons/lu"
import {useState} from "react"
import { useRef } from 'react';

function ProfilePhotoSelector({
    image,setImage,preview,setPreview
}) {

    const inputRef = useRef(null);
    const [previewUrl,setPreviewUrl] = useState(null);

    const handleImageChange=(e)=>{
        const file= e.target.files[0];
        if(file){
            setImage(file);
            const preview=URL.createObjectURL(file);
            
            setPreview(preview);
            setPreviewUrl(preview);
        }
    }

    const handleImageRemove = ()=>{
     setImage(null);
     setPreviewUrl(null);
     setPreview(null);
     
    }
// to open the hidden file selector on click
    const onChooseFile = ()=>{
        inputRef.current.click();
    }

  return (
    <div>
        {/* hidden file selector dialog */}
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
        />

        {!image ? (
            <div className="flex flex-col items-center gap-2 p-4">
                 <div className='bg-gray-300 rounded-full p-3'><LuUser className="w-16 h-16 text-gray-500" /></div>
                <button
                    type="button"
                    onClick={onChooseFile}
                    className="flex items-center
                     gap-2 px-4 py-2 rounded-full
                      text-green-400 bg-green-700
                       text-green-300 transition cursor-pointer"
                >
                   
                    <LuUpload className="w-5 h-5" />
                    
                    <span className="">Upload Photo</span>
                </button>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-2">
                <img
                    src={preview || previewUrl}
                    alt="profile photo"
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-400 shadow"
                />
                <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition mt-2"
                    onClick={handleImageRemove}
                >
                    <LuTrash className="w-4 h-4" />
                    <span>Remove</span>
                </button>
            </div>
        )}
    </div>
  )
}

export default ProfilePhotoSelector