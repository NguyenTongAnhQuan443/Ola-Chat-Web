'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContainer } from '../layout/AuthContainer'
import AuthButton from '../common/auth/AuthButton'
import DividerWithBootstrap from '../common/auth/DividerWithBootstrap'
import AuthSwitch from '../common/auth/AuthSwitchProps '

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  //Install library: npm install google-auth-library
  //Handle login with Google
  async function handleGoogleLogin() {
    try {
      const { google } = window

      const client = google.accounts.oauth2.initTokenClient({
        client_id: '714231235616-eg8j97emftncuiif0o4rsf21o4bdfeso.apps.googleusercontent.com',
        scope: 'profile email',
        callback: async (response: GoogleOAuthResponse) => {
          const idToken = response.access_token

          // Gửi token lên backend để xác thực
          const result = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken })
          })

          if (result.ok) {
            const data = await result.json()
            console.log('Login success:', data)
            localStorage.setItem('authToken', data.token) // Lưu token vào localStorage
          } else {
            console.error('Google Login failed')
          }
        }
      })

      // Hiển thị popup đăng nhập Google
      client.requestAccessToken()
    } catch (error) {
      console.error('Error during Google login:', error)
    }
  }

  //Handle login with Email: Navigate to login-email page
  async function handleEmailLogin() {
    navigate('/login-email')
  }

  //Handle login with data from database
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // Gửi email và mật khẩu lên backend để xác thực
      const result = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (result.ok) {
        const data = await result.json()
        console.log('Login success:', data)
        localStorage.setItem('authToken', data.token) // Lưu token vào localStorage
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      console.error('Error during login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <AuthButton
            onClick={handleGoogleLogin}
            icon={<img src='../../assests/icons/google.svg' alt='Google' width='20' height='20' />}
            text='Log in with Google'
          />

          <AuthButton
            onClick={handleEmailLogin}
            icon={<i className='fas fa-envelope' style={{ fontSize: '20px' }}></i>}
            text='Log in with Email'
          />

          <DividerWithBootstrap />

          <form onSubmit={onSubmit}>
            <div className='mb-3'>
              <input type='email' className='form-control' placeholder='Email' required />
            </div>

            <div className='mb-3'>
              <input type='password' className='form-control' placeholder='Password' required />
            </div>

            <div className='text-end mb-5'>
              <a href='/forgot-password' className='text-decoration-none'>
                Forgot Password?
              </a>
            </div>

            <button type='submit' className='btn btn-primary w-100' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <AuthSwitch question="Don't have an account?" buttonText='Sign up' targetRoute='/signup' />
        </div>
      </div>
    </AuthContainer>
  )
}
