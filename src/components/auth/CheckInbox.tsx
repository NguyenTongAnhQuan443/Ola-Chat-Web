import { useState } from 'react'
import { AuthContainer } from '../common/auth/AuthContainer'

export default function CheckInbox() {
  return (
    <AuthContainer>
      <div className='card shadow-sm py-5 text-center mx-auto'>
        <div className='d-flex justify-content-center mt-4'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center'
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#D4E3D6'
            }}
          ></div>
        </div>
        <div className='card-body p-4'>
          <h5 className='text-center mb-4'>Check your inbox!</h5>
          <p className='text-center text-muted mb-4'>
            Simply open your inbox and click the link to access your account. No passwords required!
          </p>
        </div>
      </div>
    </AuthContainer>
  )
}
