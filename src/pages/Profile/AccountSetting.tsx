import React, { useEffect, useState } from 'react'
import { User } from 'src/types/user.type'

export default function AccountSetting() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  async function getMyInfo() {
      const accessToken = localStorage.getItem('accessToken')
  
      if (!accessToken) {
        throw new Error('Access token not found in localStorage')
      }
  
      try {
        const response = await fetch('http://localhost:8080/ola-chat/users/my-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
  
        const data = await response.json()
        return data.data
      } catch (error) {
        console.error('Error fetching user info:', error)
        throw error
      }
    }
  
    useEffect(() => {
      // Gọi hàm getMyInfo khi component được mount
      getMyInfo()
        .then((data) => {
          setUserInfo(data)

        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin người dùng:', error)
        })
    }, [])
  
    if (!userInfo) {
      return <div>Đang tải thông tin người dùng...</div>
    }
    return (
      <div className='container mt-5'>
        <h2 className='mb-4 text-start'>Thông tin tài khoản</h2>
        <div className='card shadow-sm p-4'>
          <div className='mb-3 text-start' >
            <strong>Họ tên:</strong> {userInfo.displayName}
          </div>
          <div className='mb-3 text-start' >
            <strong>Biệt danh:</strong> {userInfo.nickname || 'Chưa có'}
          </div>
          <div className='mb-3 text-start' >
            <strong>Tên người dùng:</strong> {userInfo.username}
          </div>
          <div className='mb-3 text-start' >
            <strong>Email:</strong> {userInfo.email}
          </div>
          <div className='mb-3 text-start' >
            <strong>Ngày sinh:</strong>{' '}
            {userInfo.dob ? new Date(userInfo.dob).toLocaleDateString() : 'Chưa cập nhật'}
          </div>
          <div className='mb-3 text-start' >
            <strong>Tiểu sử:</strong> {userInfo.bio || 'Chưa có'}
          </div>
          <div className='mb-3 text-start' >
            <strong>Trạng thái:</strong> {userInfo.status}
          </div>
          <div className='mb-3 text-start' >
            <strong>Vai trò:</strong> {userInfo.role}
          </div>
          <div className='mb-3 text-start' >
            <strong>Đăng nhập qua:</strong> {userInfo.authProvider}
          </div>
          <div className='mb-3 text-start' >
            <strong>Ngày tạo:</strong> {new Date(userInfo.createdAt).toLocaleString()}
          </div>
          <div className='mb-3 text-start' >
            <strong>Cập nhật lúc:</strong> {new Date(userInfo.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    )
    
    
    
    
}
