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
    const accessToken = localStorage.getItem('accessToken');
    
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }
  
    if (!accessToken) {
      setMessage('Please log in first.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/ola-chat/auth/forgot-password?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (response.ok) {
        setMessage('A reset link has been sent to your email.');
        navigate('/verify-otp-email');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again later.');
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
