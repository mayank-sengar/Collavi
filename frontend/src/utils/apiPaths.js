export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8001" }`;


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


export default API_PATHS;