import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv from cloudinary.js (go up one level to backend root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// console.log("DEBUG: CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("DEBUG: API_KEY =", process.env.CLOUDINARY_API_KEY);
// console.log("DEBUG: API_SECRET =", process.env.CLOUDINARY_API_SECRET ? "***HIDDEN***" : "NOT SET");

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      

    //FUNCTION TO =>
//FILE IS UPLOADED ON SERVER AND OUR TARGET IS TO UPLOAD IT FROM 
//SERVER TO CLOUDINARY AND THEN UNLINK IT
    const uploadOnCloudinary = async (localFilePath) =>{
        try{
           if(!localFilePath) return null;
          //upload on cloudinary
          console.log("Uploading to Cloudinary:", localFilePath);
          const response = await cloudinary.uploader.upload(localFilePath,{
            //type of file uploading
            //automatic detects type
            resource_type:"auto" 
          })
          //file succesfully uploaded
          console.log("File uploaded on cloudinary ", response.url);
       
 
         
    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);
    
          return response
        }

        catch(error){
            console.error("Cloudinary upload error:", error);
            if (localFilePath && fs.existsSync(localFilePath)) {
              fs.unlinkSync(localFilePath);
            }
         //remove locally save temporary file as upload operation got failed

         return null;

        }
    }




export {uploadOnCloudinary}