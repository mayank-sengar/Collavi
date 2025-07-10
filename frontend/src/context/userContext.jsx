import React,{createContext,useState,useEffect} from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import API_PATHS from "../utils/apiPaths.js"

export const UserContext = createContext();

const UserProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(false);

    //fetch user on mount
    useEffect(()=>{
     let isMounted =true;
     const fetchUser = async ()=>{
        try{
            setLoading(true);
            const res = await axiosInstance.get(API_PATHS.AUTH.ME);
            console.log("user context set", res);
            if(isMounted) setUser(res.data.data || null);
        } 
        catch(error){
            console.error("Error fetching user:", error);
            if(isMounted) setUser(null);
        }
        finally{
            if (isMounted) setLoading(false);
        }
     };
     fetchUser();
     //on unmounting
     return () => {isMounted = false};
    },[]);


const updateUser = (newUser) => {
    console.log("Updating user context with:", newUser);
    setUser(newUser);
};

const clearUser = () => {
    console.log("Clearing user context");
    setUser(null);
};

return (
    <UserContext.Provider value = {{user,loading, updateUser,clearUser}}>
        {children}
    </UserContext.Provider>
);

};

export default UserProvider;


