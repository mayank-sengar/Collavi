import axiosInstance from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";



 const API_PATHS={
    AUTH:{
        // Authentication routes from /api/auth
        REGISTER: "/api/auth/register",          
        LOGIN : "/api/auth/login",             
        REFRESH_TOKEN:"/api/auth/refresh-token", 
        LOGOUT : "/api/auth/logout",            
        ONBOARD : "/api/auth/onboard",          
        ME: "/api/auth/me"                      
    },
    CHAT:{
        // Chat routes from /api/chat
        STREAM_TOKEN: "/api/chat/token"         
    },
    USER:{
        // User routes from /api/users
        RECOMMENDED: "/api/user",                                   
        FRIENDS: "/api/user/friends",                               
        SEND_FRIEND_REQUEST:(id)=> `/api/user/friend-request/${id}`,                  
        ACCEPT_FRIEND_REQUEST:(id)=> `/api/user/friend-request/${id}/accept`,        
        REJECT_FRIEND_REQUEST:(id)=> `/api/user/friend-request/${id}/reject`,         
        FRIEND_REQUESTS: "/api/user/friend-requests",                        
        OUTGOING_FRIEND_REQUESTS: "/api/user/outgoing-friend-requests" 
    }

}

export const signup = async (signupData) =>{
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,signupData);
    return response.data;
}

export const login  = async(loginData) => {
    const res  = await axiosInstance.post(API_PATHS.AUTH.LOGIN,loginData);
    return res.data;
}

export const getauthUser = async ()=>{
    try{
         const res = await axiosInstance.get(API_PATHS.AUTH.ME);
         return res.data;
    }
    catch(error){
        // Don't log 401 errors (unauthorized) as they're expected when not logged in
        if (error.response?.status !== 401) {
            console.log("Error in fetching user details ",error);
        }
        return null;
    }
}

export const onBoardUser = async(userData) => {
    const res =await axiosInstance.post(API_PATHS.AUTH.ONBOARD,
        userData
    );
    return res.data;
}

export const logout = async() => {
    const res = await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    return res.data;
}


export const getUserFriends = async () => {
    const res = await axiosInstance.get(API_PATHS.USER.FRIENDS);
    return res.data;
};


export const getRecommendedUsers = async () => {
    const res = await axiosInstance.get(API_PATHS.USER.RECOMMENDED);
    return res.data;
};

export const getOutgoingFriendRequests = async () => {
    const res = await axiosInstance.get(API_PATHS.USER.OUTGOING_FRIEND_REQUESTS);
    return res.data;
};



export const sendFriendRequest = async (userId) => {
    const res = await axiosInstance.post(API_PATHS.USER.SEND_FRIEND_REQUEST(userId));
    return res.data;
}

export const acceptFriendRequest = async (reqId) => {
    const res = await axiosInstance.put(API_PATHS.USER.ACCEPT_FRIEND_REQUEST(reqId));
    return res.data;
}

export const incommingFriendRequest = async () =>{
    const res = await axiosInstance.get(API_PATHS.USER.FRIEND_REQUESTS);
    return res.data;
}

export const getStreamToken =async ()=>{
    const res = await axiosInstance.get(API_PATHS.CHAT.STREAM_TOKEN);
    return res.data;
}
export default API_PATHS;