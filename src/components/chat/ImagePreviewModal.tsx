import React, { useState } from 'react'

interface Props {
  imageUrls: string[] // Mảng ảnh (ở đây chỉ cần 1 ảnh)
  initialIndex: number // Vị trí ảnh ban đầu
  onClose: () => void // Hàm đóng modal
}

const ImagePreviewModal = ({ imageUrls, initialIndex, onClose }: Props) => {
  const [scale, setScale] = useState(1)
  const currentImage = imageUrls[initialIndex] // Chỉ lấy ảnh hiện tại

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // Ngừng sự kiện b bubbling lên cha
    try {
      const response = await fetch(currentImage, { mode: 'cors' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const fileName = currentImage.split('/').pop()?.split('?')[0] || 'image.jpg'
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Lỗi tải ảnh:', err)
      alert('Không thể tải ảnh!')
    }
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngừng sự kiện b bubbling lên cha
    setScale((prev) => Math.min(prev + 0.2, 3)) // Giới hạn zoom tối đa là 3
  }

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngừng sự kiện b bubbling lên cha
    setScale((prev) => Math.max(prev - 0.2, 0.5)) // Giới hạn zoom tối thiểu là 0.5
  }

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngừng sự kiện b bubbling lên cha
    setScale(1) // Reset về tỉ lệ 1
  }

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center'
      style={{ zIndex: 1050 }}
      onClick={onClose} // Thoát modal khi bấm ngoài ảnh
    >
      <div onClick={(e) => e.stopPropagation()} className='position-relative text-center'>
        {/* Ảnh hiện tại */}
        <img
          src={currentImage}
          alt='preview'
          style={{
            maxHeight: '80vh',
            maxWidth: '90vw',
            transform: `scale(${scale})`, // Áp dụng scale cho ảnh
            transition: 'transform 0.2s ease',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0,0,0,0.4)'
          }}
        />
      </div>

      {/* Các nút điều khiển */}
      <div className='position-fixed bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3'>
        <button onClick={handleZoomOut} className='btn btn-outline-light'>
          ➖
        </button>
        <button onClick={handleResetZoom} className='btn btn-outline-light'>
          🔁
        </button>
        <button onClick={handleZoomIn} className='btn btn-outline-light'>
          ➕
        </button>
        <button onClick={handleDownload} className='btn btn-outline-light'>
          ⬇️
        </button>
      </div>

      {/* Nút đóng (X) */}
      <button
        onClick={onClose}
        className='btn btn-close position-absolute top-0 start-0 m-3'
        aria-label='Đóng'
        style={{ zIndex: 1060 }}
      />
    </div>
  )
}

export default ImagePreviewModal
