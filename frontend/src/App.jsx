import React from 'react'
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notifications  from './pages/Notifications';
import OnBoarding from './pages/OnBoarding';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.jsx';
import Layout from './components/Layout.jsx';
function App() {
  // const { user, loading } = useContext(UserContext);


    const {authUser, isLoading} = useAuthUser();
    const isOnboarded = authUser?.isOnboarded;

    if(isLoading ) return <PageLoader/>
  return (
    <div className='h-screen bg-gray-900 text-white'>
      <Routes>
        
    <Route path="/" element={
      authUser && isOnboarded ? (
        <Layout showSidebar={true}>
          <HomePage />
        </Layout>
      ) : !authUser ? (
        <Navigate to="/login"/>
      ) : (
        <OnBoarding />
      )
    }/>
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to="/"/>} />

        <Route path='/chat/:id' element={authUser && isOnboarded ?
            <Layout showSidebar={false}>
           <ChatPage /> 
           </Layout>
           : <Navigate to="/login"/>}/>
        <Route path='/call' element={authUser ? <CallPage /> : <Navigate to="/login"/>}/>
        <Route path='/notifications' element={
          authUser ? 
        <Layout showSidebar={true}> 
        <Notifications /> 
        </Layout> 
          : <Navigate to="/login"/> 
          }/>
        <Route path='/onboarding' element={authUser && !isOnboarded ? (<OnBoarding />) : (authUser && isOnboarded) ?<HomePage/>: (<Navigate to="/login"/>) } />
      </Routes>
    </div>
  )
}

export default App;