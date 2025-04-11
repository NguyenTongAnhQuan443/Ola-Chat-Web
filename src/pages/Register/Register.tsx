import { useState } from 'react'
import { AuthContainer } from '../../components/layout/AuthContainer'
import AuthButton from '../../components/common/auth/AuthButton'
import DividerWithBootstrap from '../../components/common/auth/DividerWithBootstrap'
import AuthSwitch from '../../components/common/auth/AuthSwitchProps '

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)

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

  //Handle login with Email
  async function handleEmailLogin() {
    try {
      const email = prompt('Enter your email:') // Hiển thị ô nhập email
      if (!email) return

      // Gửi yêu cầu lên backend để gửi mã OTP
      const result = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (result.ok) {
        alert('A login code has been sent to your email!')
      } else {
        console.error('Failed to send login code')
      }
    } catch (error) {
      console.error('Error during Email login:', error)
    }
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <AuthButton
            onClick={handleGoogleLogin}
            icon={
              <img src='https://www.svgrepo.com/show/303108/google-icon-logo.svg' alt='Google' width='20' height='20' />
            }
            text='Log in with Google'
          />

          <AuthButton
            onClick={handleEmailLogin}
            icon={
              <img
                src='https://icons.veryicon.com/png/o/business/official-icon-library-of-alibaba/email-fill.png'
                alt='Google'
                width='20'
                height='20'
              />
            }
            text='Log in with Email'
          />

          <DividerWithBootstrap />

          <form onSubmit={() => {}}>
            <div className='mb-3'>
              <input type='text' className='form-control' placeholder='Name' required />
            </div>

            <div className='mb-3'>
              <input type='email' className='form-control' placeholder='Email' required />
            </div>

            <div className='mb-3'>
              <input type='text' className='form-control' placeholder='Username' required />
            </div>

            <div className='mb-3'>
              <input type='password' className='form-control' placeholder='Password' required />
            </div>

            <div className='form-check d-flex align-items-center mb-5'>
              <input type='checkbox' className='form-check-input me-2' id='termsCheckbox' required />
              <label htmlFor='termsCheckbox' className='form-check-label'>
                I agree to the{' '}
                <a href='/terms' className='text-decoration-none' target='_blank' rel='noopener noreferrer'>
                  Terms
                </a>{' '}
                and{' '}
                <a href='/privacy' className='text-decoration-none' target='_blank' rel='noopener noreferrer'>
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button type='submit' className='btn btn-primary w-100' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          <AuthSwitch question='Have an account?' buttonText='Log in' targetRoute='/' />
        </div>
      </div>
    </AuthContainer>
  )
}
