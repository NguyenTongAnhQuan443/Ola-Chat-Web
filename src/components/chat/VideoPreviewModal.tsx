import React from 'react'

interface VideoPreviewModalProps {
  videoUrls: string[]
  initialIndex: number
  onClose: () => void
}

const VideoPreviewModal = ({ videoUrls, initialIndex, onClose }: VideoPreviewModalProps) => {
  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 1055
      }}
      onClick={onClose}
    >
      <div
        className='position-relative'
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={videoUrls[initialIndex]}
          controls
          autoPlay
          muted
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '12px',
            backgroundColor: '#000',
            objectFit: 'contain'
          }}
        />
        <button
          type='button'
          className='btn-close position-absolute top-0 end-0 m-2 bg-white p-2 rounded-circle'
          aria-label='Close'
          onClick={onClose}
        ></button>
      </div>
    </div>
  )
}

export default VideoPreviewModal
