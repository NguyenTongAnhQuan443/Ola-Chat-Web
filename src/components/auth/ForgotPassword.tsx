import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContainer } from '../layout/AuthContainer'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleBackClick = () => {
    navigate('/')
  }

  const handleSubmit = async () => {
    if (!email) {
      setMessage('Please enter your email.')
      return
    }

    try {
      // Giả sử có API gửi yêu cầu reset mật khẩu
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setMessage('A reset link has been sent to your email.')
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || 'Failed to send reset link.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <AuthContainer showBackButton={true} onBackClick={handleBackClick}>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='text-center mb-3'>Forgot password</h5>
          <p className='text-center text-muted mb-5'>
            Enter your email to reset your password and access your account.
          </p>
          <div className='mb-4'>
            <input
              type='email'
              className='form-control'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className='text-center text-info'>{message}</p>}
          <button className='btn btn-primary w-100' onClick={handleSubmit}>
            Send reset link
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
