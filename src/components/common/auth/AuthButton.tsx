import React from 'react'

interface AuthButtonProps {
  onClick: () => void // Hàm xử lý khi nhấn nút
  icon: React.ReactNode // Biểu tượng hiển thị
  text: string // Văn bản hiển thị
}

const AuthButton: React.FC<AuthButtonProps> = ({ onClick, icon, text }) => {
  return (
    <button
      className='btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2'
      style={{ borderColor: '#d6d6d6' }}
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  )
}

export default AuthButton
