import { useState } from 'react'
import { AuthContainer } from '../layout/AuthContainer'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    
    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      setError('No access token found')
      return
    }

    // Send the API request to change the password
    try {
      const response = await fetch('http://localhost:8080/ola-chat/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword, // Use the old password input
          newPassword: newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      alert('Password has been reset successfully!')

      navigate('/profile/settings/general')
      // Optionally, redirect to another page or handle further logic here
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to reset password. Please try again.')
    }
  }

  return (
    <AuthContainer>
      <div className='card shadow-sm py-4'>
        <div className='card-body p-4'>
          <h5 className='mb-5 text-center'>Reset Password</h5>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Old password'
                className='form-control'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <input
                type='password'
                placeholder='New password'
                className='form-control'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Confirm password'
                className='form-control'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className='text-danger text-center'>{error}</p>}
            <button type='submit' className='btn btn-primary w-100'>
              Reset password
            </button>
          </form>
        </div>
      </div>
    </AuthContainer>
  )
}
