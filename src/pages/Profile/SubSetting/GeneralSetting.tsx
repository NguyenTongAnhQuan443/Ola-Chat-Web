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

// const { profile } = useContext(AppContext)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [formData, setFormData] = useState({
//     fullName: profile?.fullName || '',
//     username: profile?.username || '',
//     bio: profile?.bio || ''
//   })

//   // Hiển thị preview ảnh đại diện
//   const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar || null)

//   const uploadAvatarMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const formData = new FormData()
//       formData.append('avatar', file)
//       await userApi.uploadAvatar(formData)
//       await userApi.getProfile()
//     },
//     onSuccess: () => {
//       toast.success('Upload ảnh thành công!')
//     },
//     onError: (error: any) => {
//       toast.error('Upload ảnh thất bại!')
//     }
//   })

//   const updateProfileMutation = useMutation({
//     mutationFn: async (data: typeof formData) => {
//       await userApi.updateProfile(data)
//       return await userApi.getProfile()
//     },
//     onSuccess: () => {
//       toast.success('Cập nhật thông tin thành công!')
//     },
//     onError: (error: any) => {
//       toast.error('Cập nhật thông tin thất bại!')
//     }
//   })

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
    
//     // Tạo promise array để thực hiện các mutations
//     const mutations: Promise<any>[] = []
    
//     // Nếu có file ảnh, thêm mutation upload ảnh
//     if (selectedFile) {
//       mutations.push(uploadAvatarMutation.mutateAsync(selectedFile))
//     }
    
//     // Thêm mutation cập nhật thông tin cá nhân
//     mutations.push(updateProfileMutation.mutateAsync(formData))
    
//     // Thực hiện tất cả mutations
//     Promise.all(mutations)
//       .then(() => {
//         window.location.reload()
//       })
//       .catch((error) => {
//         console.error('Error updating profile:', error)
//       })
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setSelectedFile(file)
      
//       // Tạo URL preview cho file đã chọn
//       const fileUrl = URL.createObjectURL(file)
//       setPreviewUrl(fileUrl)
      
//       // Cleanup URL khi component unmount
//       return () => URL.revokeObjectURL(fileUrl)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   return (
//     <div className='container mt-5'>
//       <h2 className='mb-4'>Cập nhật thông tin cá nhân</h2>
//       <form onSubmit={handleSubmit} className='border p-4 rounded shadow-sm'>
//         {/* Avatar upload section */}
//         <div className='mb-4 text-center'>
//           <div className='position-relative d-inline-block mb-3'>
//             {previewUrl ? (
//               <img 
//                 src={previewUrl} 
//                 className="rounded-circle" 
//                 alt="Avatar" 
//                 style={{ width: '120px', height: '120px', objectFit: 'cover' }}
//               />
//             ) : (
//               <div 
//                 className="rounded-circle bg-light d-flex align-items-center justify-content-center"
//                 style={{ width: '120px', height: '120px' }}
//               >
//                 <i className="fas fa-user fa-3x text-secondary"></i>
//               </div>
//             )}
//           </div>
          
//           <div className='mb-3'>
//             <label className='btn btn-outline-secondary'>
//               <i className="fas fa-upload me-2"></i>
//               Choose an image for avatar
//               <input
//                 type='file'
//                 accept='image/*'
//                 className='d-none'
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>
//         </div>
        
//         {/* Personal information fields */}
//         <div className='mb-3'>
//           <label className='form-label'>Full name</label>
//           <input
//             type='text'
//             className='form-control'
//             name='fullName'
//             value={formData.fullName}
//             onChange={handleInputChange}
//             placeholder='Full name'
//           />
//         </div>
        
//         <div className='mb-3'>
//           <label className='form-label'>Username</label>
//           <input
//             type='text'
//             className='form-control'
//             name='username'
//             value={formData.username}
//             onChange={handleInputChange}
//             placeholder='Username'
//           />
//         </div>
        
//         <div className='mb-4'>
//           <label className='form-label'>Bio</label>
//           <textarea
//             className='form-control'
//             name='bio'
//             value={formData.bio}
//             onChange={handleInputChange}
//             placeholder='Bio'
//             rows={4}
//           />
//         </div>
        
//         {/* Submit button */}
//         <div className='text-center'>
//           <button 
//             type='submit' 
//             className='btn btn-primary py-2 px-4'
//             disabled={uploadAvatarMutation.isPending || updateProfileMutation.isPending}
//           >
//             {(uploadAvatarMutation.isPending || updateProfileMutation.isPending) ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Saving...
//               </>
//             ) : 'Save Changes'}
//           </button>
//         </div>
//       </form>
      
//       <div className='text-end mb-5 mt-3'>
//         <a href={path.resetPassword} className='text-decoration-none text-primary'>
//           <i className="fas fa-key me-1"></i> Update password
//         </a>
//       </div>
//     </div>
//   )