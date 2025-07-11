import axios from "axios";
import {BASE_URL} from './apiPaths';


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials:true
});

axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
       
          if(error.response && error.response.status === 500){
          console.log("Server error. Please try again later");
        }
        else if(error.code === "ECONNABORTED"){
            console.log("Request timeout. Please try again");
        }
        return Promise.reject(error);

    }
);


export default axiosInstance;