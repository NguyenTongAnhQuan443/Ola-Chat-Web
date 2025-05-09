import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import path from 'src/constants/path'

export default function GeneralSetting() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {

      const formData = new FormData()
      formData.append('avatar', file)

      await userApi.uploadAvatar(formData)

      await userApi.getProfile()
      window.location.reload()
    },
    onSuccess: () => {
      toast.success('Upload ảnh thành công!')
    },
    onError: (error: any) => {
      toast.error('Upload ảnh thất bại!')
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile)
    } else {
      toast.warning('Vui lòng chọn ảnh để upload!')
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
