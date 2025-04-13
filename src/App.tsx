import React from 'react'
import { Routes, Route , Navigate} from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import SignUpPage from './pages/Register'
import VerifyPhone from './pages/verifyOTP/VerifyPhone'
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
import PostList from './pages/PostList'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import path from './constants/path'
import SettingsLayout from './pages/Profile/SettingsLayout'
import GeneralSetting from './pages/Profile/GeneralSetting'
import AccountSetting from './pages/Profile/AccountSetting'
import LogoutSetting from './pages/Profile/LogoutSetting'
import VerifyOTPFEmail from './components/auth/VerifyOTPFEmail'
import HistoryLogin from './pages/Profile/HistoryLogin'

//Preaprera Setup Protected Route và Rejected Route trong React Router

function App() {
  return (
    <div className='App'>
      <ToastContainer />
      <Routes>

      <Route path={path.dashboard} element={<Navigate to={path.login}replace />} />
        {/* Auth routes */}
        <Route path={path.login} element={<Login />} />
        <Route path={path.signup} element={<SignUpPage />} />
        <Route path={path.verifyPhone} element={<VerifyPhone />} />
        <Route path={path.resetPassword} element={<ResetPassword />} />
        <Route path={path.forgotPassword} element={<ForgotPassword />} />
        <Route path={path.verifyOTP} element={<VerifyOTP />} />
        <Route path={path.checkInbox} element={<CheckInbox />} />
        <Route path={path.loginEmail} element={<LoginEmail />} />
        <Route path={path.verifyOTPFEmail} element={<VerifyOTPFEmail />} />

        {/* Public routes */}

        {/* Protected layout with sidebar + header */}
        <Route  element={<Layout />}>
          <Route path={path.home} element={<Home />} />
          <Route path={path.profile.slice(1)} element={<Profile />}>
            <Route path='my-posts' element={<PostList />} />
            <Route path='saved-posts' element={<PostList />} />
            <Route path='settings' element={<SettingsLayout />}>
              <Route path='general' element={<GeneralSetting />} />
              <Route path='account' element={<AccountSetting />} />
              <Route path='logout' element={<LogoutSetting />} />
              <Route path='history-login' element={<HistoryLogin />} />
            </Route>
          </Route>
          <Route path={path.messages.slice(1)} element={<Messages />} />
          <Route path={path.notifications.slice(1)} element={<Notifications />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
