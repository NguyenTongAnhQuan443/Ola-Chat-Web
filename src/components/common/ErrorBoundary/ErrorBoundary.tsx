import { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className='d-flex flex-column justify-content-center align-items-center vh-100 position-relative text-center'>
          <h1 className='display-1 fw-bold text-dark'>500</h1>
          <div
            className='position-absolute bg-warning text-white px-2 py-1 small rounded'
            style={{ transform: 'rotate(12deg)', top: '20%', right: '50%' }}
          >
            Error!
          </div>
          <a href='/' className='btn btn-outline-warning mt-4 px-4 py-2 fw-medium position-relative'>
            Go Home
          </a>
        </main>
      )
    }

    return this.props.children
  }
}
