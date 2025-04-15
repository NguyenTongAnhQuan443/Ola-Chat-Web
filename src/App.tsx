import React, { useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import Messages from './pages/Message/page'
import useRouteElements from './useRouteElements'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/common/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Khi url thay đổi thì các component nào dùng các hook như
 * useRoutes, useParmas, useSearchParams,...
 * sẽ bị re-render.
 * Ví dụ component `App` dưới đây bị re-render khi mà url thay đổi
 * vì dùng `useRouteElements` (đây là customhook của `useRoutes`)
 */


function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} theme='light' />
        {routeElements}
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </HelmetProvider>
  )
}

export default App
