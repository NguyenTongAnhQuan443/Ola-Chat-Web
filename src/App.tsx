import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import SignUpPage from './pages/Register'
import ResetPassword from './components/auth/ResetPassword'
import ForgotPassword from './components/auth/ForgotPassword'
import VerifyOTP from './components/auth/VerifyOTP'
import CheckInbox from './components/auth/CheckInbox'
import LoginEmail from './components/auth/LoginEmail'
import Layout from './pages/DashboardPage'
import Home from './pages/HomePage'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/check-inbox' element={<CheckInbox />} />
        <Route path='/login-email' element={<LoginEmail />} />

        {/* Layout chung (Header + Sidebar giữ nguyên) */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='messages' element={<Messages />} />
          <Route path='notifications' element={<Notifications />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
