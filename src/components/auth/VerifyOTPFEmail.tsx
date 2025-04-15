import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContainer } from '../../components/layout/AuthContainer'

export default function VerifyOTPEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const email = params.get('email') || 'phat172003@gmail.com' // Lấy email từ query params
  const [timeLeft, setTimeLeft] = useState(45)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const handleResend = () => {
    setTimeLeft(45)
    console.log('Resend OTP to:', email)
    // Gọi lại API resend nếu cần
  }

  const handleSubmit = async () => {
    if (!otp || !newPassword) {
      setError('Please enter OTP and new password.')
      return
    }

    try {
      // Gọi API reset password
      const response = await fetch('http://localhost:8080/ola-chat/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })

      if (response.ok) {
        setSuccessMessage('Your password has been successfully reset.')
        setTimeout(() => {
          navigate('/login') // Chuyển hướng đến trang login sau khi reset thành công
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to reset password.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='text-center mb-3'>Enter verification code</h5>
          <p className='text-center text-muted mb-4'>
            Code sent to <strong>{email}</strong>
          </p>

          <div className='mb-4'>
            <input
              type='text'
              maxLength={6}
              className='form-control text-center'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter OTP'
            />
          </div>

          <div className='mb-4'>
            <input
              type='password'
              className='form-control'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
            />
          </div>

          {error && <p className='text-danger text-center'>{error}</p>}
          {successMessage && <p className='text-success text-center'>{successMessage}</p>}

          <div className='text-center mb-4'>
            {timeLeft > 0 ? (
              <small className='text-muted'>
                Resend in <strong>{timeLeft}s</strong>
              </small>
            ) : (
              <button className='btn btn-link p-0' onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </div>

          <button className='btn btn-primary w-100' onClick={handleSubmit} disabled={otp.length < 6 || !newPassword}>
            Reset Password
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
