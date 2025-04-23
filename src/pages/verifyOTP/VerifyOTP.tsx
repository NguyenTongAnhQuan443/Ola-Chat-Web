import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContainer } from '../../components/layout/AuthContainer'

export default function VerifyOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const phone = params.get('phone') || '0349559555'
  const [timeLeft, setTimeLeft] = useState(45)
  const [code, setCode] = useState('') // Chuyển sang string
  const [error, setError] = useState('')

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
    console.log('Resend OTP to:', phone)
    // Gọi lại API resend nếu cần
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Chỉ lấy số
    setCode(value.slice(0, 6)) // Giới hạn 6 chữ số
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/ola-chat/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: code })
      })

      if (response.ok) {
        navigate(`/signup`,  { state: { phone } })
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Verification failed')
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
            Code sent to <strong>{phone}</strong>
          </p>

          <div className='d-flex justify-content-center mb-4'>
            <input
              type='text'
              maxLength={6}
              className='form-control text-center'
              style={{
                width: '200px',
                height: '50px',
                fontSize: '1.5rem',
                letterSpacing: '10px'
              }}
              value={code}
              onChange={handleInputChange}
            />
          </div>

          {error && <p className='text-danger text-center'>{error}</p>}

          <div className='text-center mb-4'>
            {timeLeft > 0 ? (
              <small className='text-muted'>
                Resend in <strong>{timeLeft}s</strong>
              </small>
            ) : (
              <button className='btn btn-link p-0' onClick={handleResend}>
                Resend
              </button>
            )}
          </div>

          <button className='btn btn-primary w-100' onClick={handleSubmit} disabled={code.length < 6}>
            Verify
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
