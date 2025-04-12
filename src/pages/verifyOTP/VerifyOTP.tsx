import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContainer } from '../../components/layout/AuthContainer'

export default function VerifyOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const phone = params.get('phone') || ''
  const [timeLeft, setTimeLeft] = useState(45)
  const [code, setCode] = useState(['', '', '', '', '', '']) // Nếu OTP 6 số
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
      const response = await fetch('http://localhost:8080/ola-chat/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })

      if (response.ok) {
        navigate(`/signup?username=${phone}`)
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
