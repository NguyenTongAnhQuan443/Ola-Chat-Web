import React, { useContext, useEffect, useState } from 'react'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { User } from 'src/types/user.type'

export default function AccountSetting() {
  const { profile, setProfile } = useContext(AppContext)

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4 text-start'>Thông tin tài khoản</h2>
      <div className='card shadow-sm p-4'>
        <div className='mb-3 text-start'>
          <strong>Họ tên:</strong> {profile.displayName}
        </div>
        <div className='mb-3 text-start'>
          <strong>Biệt danh:</strong> {profile.nickname || 'Chưa có'}
        </div>
        <div className='mb-3 text-start'>
          <strong>Tên người dùng:</strong> {profile.username}
        </div>
        <div className='mb-3 text-start'>
          <strong>Email:</strong> {profile.email}
        </div>
        <div className='mb-3 text-start'>
          <strong>Ngày sinh:</strong> {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Chưa cập nhật'}
        </div>
        <div className='mb-3 text-start'>
          <strong>Tiểu sử:</strong> {profile.bio || 'Chưa có'}
        </div>
        <div className='mb-3 text-start'>
          <strong>Trạng thái:</strong> {profile.status}
        </div>
        <div className='mb-3 text-start'>
          <strong>Vai trò:</strong> {profile.role}
        </div>
        <div className='mb-3 text-start'>
          <strong>Đăng nhập qua:</strong> {profile.authProvider}
        </div>
        <div className='mb-3 text-start'>
          <strong>Ngày tạo:</strong> {new Date(profile.createdAt).toLocaleString()}
        </div>
        <div className='mb-3 text-start'>
          <strong>Cập nhật lúc:</strong> {new Date(profile.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
