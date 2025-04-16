import { useState } from 'react'
import { Message } from 'src/types/message.type'

interface Props {
  message: Message
  currentUserId: string
}

const MessageItem = ({ message, currentUserId }: Props) => {
  const isMine = message.senderId === currentUserId
  const isMedia = message.type === 'MEDIA'
  const isSending = (message as any).isSending
  const isError = (message as any).isError

  const getExtension = (url?: string | null) => {
    if (!url) return ''
    const cleanUrl = url.split('?')[0]
    return cleanUrl.split('.').pop()?.toLowerCase() || ''
  }

  const renderMedia = () => {
    const mediaCount = message.mediaUrls?.length || 0
    const [loadedIndexes, setLoadedIndexes] = useState<number[]>([])

    const handleImageLoad = (index: number) => {
      setLoadedIndexes((prev) => [...prev, index])
    }

    const getGridColumns = () => {
      if (mediaCount === 1) return '1fr'
      if (mediaCount <= 3) return 'repeat(2, 1fr)'
      return 'repeat(2, 1fr)'
    }

    return (
      <div
        className='d-grid'
        style={{
          gridTemplateColumns: getGridColumns(),
          gap: '8px',
          maxWidth: '100%',
          width: '100%',
          borderRadius: '10px'
        }}
      >
        {message.mediaUrls?.map((url, index) => {
          const ext = getExtension(url)
          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
          const isVideo = ['mp4', 'webm', 'ogg'].includes(ext)
          const isLoaded = loadedIndexes.includes(index)

          if (!url) {
            return (
              <p key={index} className='text-muted small'>
                Đường dẫn không hợp lệ
              </p>
            )
          }

          if (isImage) {
            return (
              <div key={index} className='position-relative' style={{ height: '150px', width: '100%' }}>
                {(isSending || !isLoaded) && (
                  <div className='position-absolute top-50 start-50 translate-middle'>
                    <div
                      className='spinner-border text-primary'
                      role='status'
                      style={{ width: '2rem', height: '2rem' }}
                    />
                  </div>
                )}
                <img
                  src={url}
                  alt={`media-${index}`}
                  onLoad={() => handleImageLoad(index)}
                  className='img-fluid rounded'
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: isLoaded ? 'block' : 'none',
                    opacity: isSending ? 0.6 : 1,
                    filter: isError ? 'grayscale(100%) blur(1px)' : 'none'
                  }}
                />
              </div>
            )
          } else if (isVideo) {
            return (
              <video
                key={index}
                controls
                className='rounded'
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  opacity: isSending ? 0.6 : 1,
                  filter: isError ? 'grayscale(100%) blur(1px)' : 'none'
                }}
              >
                <source src={url} type='video/mp4' />
                Trình duyệt không hỗ trợ phát video.
              </video>
            )
          } else {
            return (
              <p key={index} className='text-muted small'>
                Định dạng không hỗ trợ
              </p>
            )
          }
        })}
      </div>
    )
  }

  const renderContent = () => {
    if (message.recalled) {
      return <p className='mb-0 text-muted fst-italic'>Tin nhắn đã được thu hồi</p>
    }

    if (message.type === 'TEXT') {
      return (
        <div
          className={`rounded-3 shadow-sm ${isMine ? 'text-white' : 'text-dark'}`}
          style={{
            backgroundColor: isMine ? '#4F46E5' : '#f1f1f1',
            maxWidth: '60%',
            padding: '10px 15px'
          }}
        >
          <p className='mb-0'>{message.content}</p>
        </div>
      )
    }

    if (message.type === 'MEDIA') {
      return (
        <>
          {message.content && (
            <div
              className={`rounded-3 shadow-sm ${isMine ? 'text-white' : 'text-dark'} p-3`}
              style={{
                backgroundColor: isMine ? '#4F46E5' : '#f1f1f1',
                maxWidth: '60%'
              }}
            >
              <p className='mb-0'>{message.content}</p>
            </div>
          )}
          <div className={`mt-2 ${isMine ? 'align-self-end' : 'align-self-start'}`}>{renderMedia()}</div>
          {isError && <div className='text-danger small mt-1 text-center'>Gửi thất bại. Vui lòng thử lại.</div>}
        </>
      )
    }

    return <p className='mb-0 text-muted'>Không hỗ trợ loại tin nhắn này</p>
  }

  return (
    <div className={`d-flex flex-column ${isMine ? 'align-items-end' : 'align-items-start'} my-2`}>
      {renderContent()}
      <div className='text-muted small' style={{ fontSize: '0.75rem', marginTop: '5px' }}>
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default MessageItem
