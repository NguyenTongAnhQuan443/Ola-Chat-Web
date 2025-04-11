import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContainer } from '../common/auth/AuthContainer'

export default function LoginEmail() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBackClick = () => {
    navigate('/')
  }

  const handleSubmit = async () => {
    if (!email) {
      setMessage('Please enter your email.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Email invalid.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Giả sử có API gửi yêu cầu đăng nhập qua email
      const response = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setMessage('A login link has been sent to your email.')

        // Chuyển hướng sang trang verify-otp và truyền email qua URL
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || 'Login request failed.')
      }
    } catch (error) {
      console.error('Lỗi:', error)
      setMessage('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer showBackButton={true} onBackClick={handleBackClick}>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='text-center mb-3'>Enter your email</h5>
          <p className='text-center text-muted mb-5'>
            We'll send a secure link for instant <br /> access to your account.
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
          <button className='btn btn-primary w-100' onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send link'}
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
