import React, { useEffect, useState } from 'react'
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notifications  from './pages/Notifications';
import OnBoarding from './pages/OnBoarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { axiosInstance } from './axios.js';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingToastId = toast.loading('Loading...');
    axiosInstance.get('/auth/me')
      .then(res => setAuthUser(res.data.user))
      .catch(() => setAuthUser(null))
      .finally(() => {
        setLoading(false);
        toast.dismiss(loadingToastId);
      });
  }, []);

  if (loading) return <Toaster position='top-right' reverseOrder={false} />;

  return (
    <div className='h-screen' data-theme="dark">
<button className="btn">Button</button>
<button className="btn btn-neutral">Neutral</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/"/>} />
        <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to="/login"/>}/>
        <Route path='/call' element={authUser ? <CallPage /> : <Navigate to="/login"/>}/>
        <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to="/login"/>} />
        <Route path='/onboarding' element={authUser ? <OnBoarding /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App