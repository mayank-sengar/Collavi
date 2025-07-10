import React, { useContext } from 'react'
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notifications  from './pages/Notifications';
import OnBoarding from './pages/OnBoarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UserProvider, { UserContext } from './context/userContext.jsx';

function AppContent() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Toaster position='top-right' reverseOrder={false} />;

  return (
    <div className='h-screen' data-theme="dark">
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to="/"/>} />
        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/"/>} />
        <Route path='/chat' element={user ? <ChatPage /> : <Navigate to="/login"/>}/>
        <Route path='/call' element={user ? <CallPage /> : <Navigate to="/login"/>}/>
        <Route path='/notifications' element={user ? <Notifications /> : <Navigate to="/login"/>} />
        <Route path='/onboarding' element={user ? <OnBoarding /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;