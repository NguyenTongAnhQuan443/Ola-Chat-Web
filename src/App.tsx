import React, { useContext, useEffect, useState } from 'react'
import './App.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import useRouteElements from './useRouteElements'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/common/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { messaging, getToken, onMessage } from './firebase'
import { MessagePayload } from 'firebase/messaging'

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

  const [token, setToken] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)

          // Lấy token FCM
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              interface FCMTokenError extends Error {
                code?: string
                message: string
              }

              getToken(messaging, {
                vapidKey: '',
                serviceWorkerRegistration: registration
              })
                .then((currentToken: string | null) => {
                  if (currentToken) {
                    setToken(currentToken)
                    console.log('FCM Token:', currentToken)
                  } else {
                    console.warn('No token received.')
                  }
                })
                .catch((err: FCMTokenError) => {
                  console.error('An error occurred while retrieving token. ', err)
                })
            }
          })
        })
        .catch((err) => {
          console.error('SW registration failed:', err)
        })
      // Nhận notification khi app đang mở
      onMessage(messaging, (payload: MessagePayload) => {
        console.log('Message received: ', payload)
      })
    }
  }, [])

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} theme='light' />
        {routeElements}
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
