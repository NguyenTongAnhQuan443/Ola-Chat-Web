import React, { useContext, useEffect } from 'react'
import './App.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
    </HelmetProvider>
  )
}

export default App
