import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContainer } from '../layout/AuthContainer'

export default function VerifyOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = location.state?.phone || 'unknown'

  const [timeLeft, setTimeLeft] = useState(45)
  const [code, setCode] = useState(['', '', '', ''])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const handleResend = async () => {
    setTimeLeft(45)
    try {
      const res = await fetch('http://localhost:8080/ola-chat/twilio/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await res.json()
      setMessage(result.message || 'OTP resent!')
    } catch (err) {
      setMessage('Failed to resend OTP.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1)
    if (!isNaN(Number(value))) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      if (value && index < code.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleSubmit = async () => {
    const otp = code.join('')
    try {
      const res = await fetch('http://localhost:8080/ola-chat/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('OTP verified successfully!')
        // Ví dụ điều hướng tiếp:
        // navigate('/reset-password')
      } else {
        setMessage(data.message || 'OTP verification failed.')
      }
    } catch (error) {
      setMessage('An error occurred while verifying OTP.')
    }
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='text-center mb-3'>Enter verification code</h5>
          <p className='text-center text-muted mb-3'>
            Code sent to <strong>{phone}</strong>
          </p>

          <div className='d-flex justify-content-center mb-4'>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type='text'
                maxLength={1}
                className='form-control text-center mx-1'
                style={{ width: '50px', fontSize: '1.5rem' }}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
          </div>

          <div className='text-center mb-3'>
            {timeLeft > 0 ? (
              <small className='text-muted'>
                Resend in <strong>{timeLeft}s</strong>
              </small>
            ) : (
              <button className='btn btn-link p-0 text-decoration-none' onClick={handleResend}>
                Resend
              </button>
            )}
          </div>

          {message && <p className='text-center text-info mb-3'>{message}</p>}

          <button
            className='btn btn-primary w-100'
            onClick={handleSubmit}
            disabled={code.includes('')}
          >
            Verify
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
