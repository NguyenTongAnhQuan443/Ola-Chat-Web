import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContainer } from '../../components/layout/AuthContainer'

export default function VerifyPhone() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleBackClick = () => {
    navigate('/login')
  }

  const handleSubmit = async () => {
    if (!phone) {
      setMessage('Please enter your phone number.')
      return
    }

    try {
      const response = await fetch('http://localhost:8080/ola-chat/twilio/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone }) // ✅ đổi thành phone
      })

      if (response.ok) {
        setMessage('OTP has been sent to your phone.')

        // ✅ Điều hướng sang verify-otp sau 1s
        setTimeout(() => {
          navigate('/verify-otp', { state: { phone } })
        }, 1000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || 'Failed to send OTP.')
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
          <h5 className='text-center mb-3'>Verify with Phone number</h5>
          <p className='text-center text-muted mb-5'>
            Enter your phone number to receive a verification code.
          </p>
          <div className='mb-4'>
            <input
              type='text'
              className='form-control'
              placeholder='Phone number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {message && <p className='text-center text-info'>{message}</p>}
          <button className='btn btn-primary w-100' onClick={handleSubmit}>
            Send OTP
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
