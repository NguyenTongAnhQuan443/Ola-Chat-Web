import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import path from 'src/constants/path'

export default function GeneralSetting() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const updateUserInfo = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) throw new Error('Access token not found')

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
      localStorage.setItem('userInfo', JSON.stringify(data.data)) // Lưu vào localStorage
      return data.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) throw new Error('Access token not found')

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('http://localhost:8080/ola-chat/users/my-avatar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`
          // ❌ KHÔNG thêm 'Content-Type' vì browser sẽ tự thêm boundary cho multipart
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload thất bại')
      }

      // Sau khi upload ảnh thành công, gọi lại getMyInfo để lấy lại thông tin người dùng
      await updateUserInfo() // Cập nhật thông tin người dùng vào localStorage
      window.location.reload() // Tải lại trang để cập nhật thông tin

      const result = await response.json()
      return result
    },
    onSuccess: () => {
      alert('Upload ảnh thành công!')
    },
    onError: (error: any) => {
      console.error('Upload ảnh lỗi:', error)
      alert('Upload thất bại: ' + error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile)
    } else {
      alert('Vui lòng chọn ảnh!')
    }
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Cập nhật ảnh đại diện</h2>
      <form onSubmit={handleSubmit} className='border p-4 rounded shadow-sm'>
        <div className='mb-3'>
          <label className='form-label'>Chọn ảnh mới:</label>
          <input
            type='file'
            accept='image/*'
            className='form-control'
            onChange={(e) => {
              const file = e.target.files?.[0]
              setSelectedFile(file || null)
            }}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Upload ảnh
        </button>
      </form>
      <div className='text-end mb-5 mt-3'>
        <a href={path.resetPassword} className='text-decoration-none text-primary'>
          Update password
        </a>
      </div>
    </div>
  )
}
