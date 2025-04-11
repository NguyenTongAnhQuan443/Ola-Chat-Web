import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContainer } from '../common/auth/AuthContainer'

export default function VerifyOTP() {
  //Get email from query string
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  //Neu email khong co gia tri thi se tra ve example@gmail
  const email = params.get('email') || 'example@gmail.com'
  //For OTP verification
  const [timeLeft, setTimeLeft] = useState(45)
  const [code, setCode] = useState(['', '', '', ''])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const handleResend = () => {
    // Đặt lại thời gian và thực hiện logic gửi mã xác thực
    setTimeLeft(45)
    console.log('Verification code resent!')
    // Thêm logic gửi mã xác thực tại đây (API call nếu cần)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1) // Chỉ lấy ký tự cuối cùng
    if (!isNaN(Number(value))) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Tự động chuyển đến ô tiếp theo
      if (value && index < code.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleSubmit = () => {
    alert(`Submitted code: ${code.join('')}`)
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='text-center mb-3'>Enter verification code</h5>
          <p className='text-center text-muted mb-5'>
            Code sent to <strong>{email}</strong>
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

          <div className='text-center mb-5'>
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

          <button
            className='btn btn-primary w-100'
            onClick={handleSubmit}
            disabled={code.includes('') || timeLeft === 0}
          >
            Verify
          </button>
        </div>
      </div>
    </AuthContainer>
  )
}
