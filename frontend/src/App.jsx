import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import {Routes,Route, Navigate } from "react-router-dom"
import HomePage from './pages/HomePage'
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemseStore'
function App() {

  const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(()=>{
 checkAuth()
  },[checkAuth])



  if(isCheckingAuth && !authUser) return(
    <div className=' flex items-center justify-center h-screen'>
      <Loader className=" size-10 animate-spin" />
    </div>
  )

  return (
  <div data-theme={theme}>
   <Navbar/>
   <Routes>
    <Route path='/' element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
    <Route path='/signup' element={ !authUser && <SignupPage/>}/>
    <Route path='/login' element={!authUser && <LoginPage/>}/>
    <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
    <Route path='/settings' element={authUser ? <SettingsPage/> : <Navigate to="/login"/>}/>

   </Routes>
   <Toaster/>
   </div>
  )
}

export default App
