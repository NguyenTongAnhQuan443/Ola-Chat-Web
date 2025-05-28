import React, { useState } from 'react'

interface Props {
  imageUrls: string[] // Mảng ảnh (ở đây chỉ cần 1 ảnh)
  initialIndex: number // Vị trí ảnh ban đầu
  onClose: () => void // Hàm đóng modal
}

const ImagePreviewModal = ({ imageUrls, initialIndex, onClose }: Props) => {
  const [scale, setScale] = useState(1)
  const currentImage = imageUrls[initialIndex]

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
      className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center'
      style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 1, 0.5)' }}
      onClick={onClose} // Thoát modal khi bấm ngoài ảnh
    >
      <button
        onClick={onClose}
        className='btn position-absolute'
        style={{
          top: '5px',
          right: '30px',
          color: 'white',
          background: 'transparent',
          border: 'none',
          fontSize: '3rem'
        }}
        title='Đóng'
      >
        &times;
      </button>
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
        <button onClick={handleZoomOut} className='btn btn-outline-light' title='Zoom out'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-zoom-out'
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'
            />
            <path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z' />
            <path fillRule='evenodd' d='M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z' />
          </svg>
        </button>

        <button onClick={handleResetZoom} className='btn btn-outline-light' title='Reset zoom'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-arrow-counterclockwise'
            viewBox='0 0 16 16'
          >
            <path fillRule='evenodd' d='M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z' />
            <path d='M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z' />
          </svg>
        </button>

        <button onClick={handleZoomIn} className='btn btn-outline-light' title='Zoom in'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-zoom-in'
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z'
            />
            <path d='M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z' />
            <path
              fillRule='evenodd'
              d='M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z'
            />
          </svg>
        </button>

        <button onClick={handleDownload} className='btn btn-outline-light' title='Download'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-download'
            viewBox='0 0 16 16'
          >
            <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z' />
            <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ImagePreviewModal
