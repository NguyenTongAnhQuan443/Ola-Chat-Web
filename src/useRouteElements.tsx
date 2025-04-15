import React, { useContext } from 'react'
import { Navigate, useRoutes , Outlet} from 'react-router-dom'

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
import Notifications from './pages/Notifications'
import PostList from './pages/PostList'

import path from './constants/path'
import SettingsLayout from './pages/Profile/SettingsLayout'
import GeneralSetting from './pages/Profile/GeneralSetting'
import AccountSetting from './pages/Profile/AccountSetting'
import LogoutSetting from './pages/Profile/LogoutSetting'
import VerifyOTPFEmail from './components/auth/VerifyOTPFEmail'
import HistoryLogin from './pages/Profile/HistoryLogin'
import Messages from './pages/Message/page'
import { AppContext } from './contexts/app.context'

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
  }
  
  function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />
  }
  

  export default function useRouteElements() {
    const routeElements = useRoutes([
      // Rejected routes (chỉ vào được khi chưa login)
      {
        path: '',
        element: <RejectedRoute />,
        children: [
          {
            path: '',
            children: [
              { path: path.login, element: <Login /> },
              { path: path.signup, element: <SignUpPage /> },
              { path: path.verifyPhone, element: <VerifyPhone /> },
              { path: path.resetPassword, element: <ResetPassword /> },
              { path: path.forgotPassword, element: <ForgotPassword /> },
              { path: path.verifyOTP, element: <VerifyOTP /> },
              { path: path.checkInbox, element: <CheckInbox /> },
              { path: path.loginEmail, element: <LoginEmail /> },
              { path: path.verifyOTPFEmail, element: <VerifyOTPFEmail /> }
            ]
          }
        ]
      },
  
      // Protected routes (cần login mới vào được)
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <Layout />, // Layout chung (sidebar + header)
            children: [
              { path: path.home, element: <Home /> },
              {
                path: path.profile.slice(1),
                element: <Profile />,
                children: [
                  { path: 'my-posts', element: <PostList /> },
                  { path: 'saved-posts', element: <PostList /> },
                  {
                    path: 'settings',
                    element: <SettingsLayout />,
                    children: [
                      { path: 'general', element: <GeneralSetting /> },
                      { path: 'account', element: <AccountSetting /> },
                      { path: 'logout', element: <LogoutSetting /> },
                      { path: 'history-login', element: <HistoryLogin /> }
                    ]
                  }
                ]
              },
              { path: path.messages.slice(1), element: <Messages /> },
              { path: path.notifications.slice(1), element: <Notifications /> }
            ]
          }
        ]
      },
  
      // Redirect dashboard về login (hoặc nơi khác nếu muốn)
      {
        path: path.dashboard,
        element: <Navigate to={path.login} replace />
      }
    ])
  
    return routeElements
  }
  
