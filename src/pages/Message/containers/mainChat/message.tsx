import { log } from 'console'
import { useState } from 'react'
import ImagePreviewModal from 'src/components/chat/ImagePreviewModal'
import MessageActions from 'src/components/chat/MessageActions'
import VideoPreviewModal from 'src/components/chat/VideoPreviewModal'
import { Message } from 'src/types/message.type'
import { UserDTO } from 'src/types/user.type'

interface Props {
  message: Message
  currentUserId: string
  users: UserDTO[]
  conversationType: string
}
const emojiList = ['❤️', '😆', '😮', '😢', '😡', '👍', '👎']

const MessageItem = ({ message, currentUserId, users, conversationType }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const isMine = message.senderId === currentUserId
  const isSending = (message as any).isSending
  const isError = (message as any).isError
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const isCurrentUser = message.senderId === currentUserId
  const sender = users.find((u) => u.userId === message.senderId)
  const avatar = sender?.avatar || '/default-avatar.png'
  const displayName = sender?.displayName || ''

  const handleHover = (isHovered: boolean) => {
    setIsHovered(isHovered)
  }

  const handleForward = () => {
    // Xử lý chuyển tiếp tin nhắn
    console.log('Chuyển tiếp tin nhắn')
  }

  const handleReact = () => {
    console.log('Nhấn react')

    setShowEmojiPicker((prev) => !prev)
  }

  const handleMoreOptions = () => {
    // Xử lý các tùy chọn khác
    console.log('Các tùy chọn khác')
  }

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
                {(isSending || !loadedIndexes.includes(index)) && (
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
                    display: loadedIndexes.includes(index) ? 'block' : 'none',
                    opacity: isSending ? 0.6 : 1,
                    filter: isError ? 'grayscale(100%) blur(1px)' : 'none'
                  }}
                  onClick={() => setPreviewImage(url)} // Chỉ hiển thị ảnh khi bấm vào
                />
              </div>
            )
          } else if (isVideo) {
            return (
              <div key={index} className='position-relative' style={{ height: '150px', width: '100%' }}>
                <video
                  ref={(video) => {
                    if (video) {
                      video.onplay = (e) => {
                        // Tạm dừng tất cả video khác khi một video được phát
                        document.querySelectorAll('video').forEach((v) => {
                          if (v !== video) v.pause()
                        })
                      }
                    }
                  }}
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
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Dừng tất cả video trước khi mở modal
                    document.querySelectorAll('video').forEach((v) => v.pause())
                    setPreviewVideo(url)
                  }}
                >
                  <source src={url} type='video/mp4' />
                  Trình duyệt không hỗ trợ phát video.
                </video>
              </div>
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
                backgroundColor: isMine ? '#4F46E5' : '#f1f1f1'
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

    if (message.type === 'STICKER') {
      const stickerUrl = message.mediaUrls?.[0]

      if (!stickerUrl) {
        return <p className='text-muted'>Không tìm thấy sticker</p>
      }

      return (
        <div style={{ maxWidth: '180px', maxHeight: '180px' }}>
          <img
            src={stickerUrl}
            alt='sticker'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '12px',
              opacity: isSending ? 0.6 : 1,
              filter: isError ? 'grayscale(100%) blur(1px)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => setPreviewImage(stickerUrl)}
          />
        </div>
      )
    }
    return <p className='mb-0 text-muted'>Không hỗ trợ loại tin nhắn này</p>
  }

  return (
    <div
      className={`d-flex my-2 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {!isMine && (
        <div className='me-2'>
          <img
            src={avatar}
            alt='avatar'
            className='rounded-circle'
            style={{ width: '28px', height: '28px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div
        className={`d-flex flex-column ${isMine ? 'align-items-end' : 'align-items-start'}`}
        style={{ maxWidth: '70%' }}
      >
        {!isMine && conversationType === 'GROUP' && <span className='small mb-1'>{displayName}</span>}

        <div className='d-flex align-items-center position-relative' style={{ maxWidth: '100%' }}>
          {renderContent()}

          {isHovered && (
            <div
              className='position-absolute'
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                [isMine ? 'left' : 'right']: '-80px',
                zIndex: 1,
                display: 'flex',
                gap: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                padding: '5px'
              }}
            >
              <MessageActions onForward={handleForward} onReact={handleReact} onMoreOptions={handleMoreOptions} />

              {showEmojiPicker && (
                <div
                  className='mt-1'
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 15, // Đảm bảo nó nằm trên các phần tử khác nhưng không che mất actions
                    padding: '6px 8px',
                    display: 'flex',
                    gap: '8px',
                    top: '100%', // Đặt nó bên dưới hoặc điều chỉnh theo ý muốn
                    left: 0 // Điều chỉnh vị trí bên trái của emoji picker
                  }}
                >
                  {emojiList.map((emoji) => (
                    <span
                      key={emoji}
                      style={{
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease-in-out'
                      }}
                      onClick={() => {
                        console.log(`Reacted with: ${emoji}`)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className='text-muted small' style={{ fontSize: '0.75rem', marginTop: '5px' }}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
      </div>

      {previewImage && (
        <ImagePreviewModal imageUrls={[previewImage]} initialIndex={0} onClose={() => setPreviewImage(null)} />
      )}

      {previewVideo && (
        <VideoPreviewModal videoUrls={[previewVideo]} initialIndex={0} onClose={() => setPreviewVideo(null)} />
      )}
    </div>
  )
}

export default MessageItem
