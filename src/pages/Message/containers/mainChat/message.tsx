import { Message } from 'src/types/message.type'

interface Props {
  message: Message
  currentUserId: string
}

const MessageItem = ({ message, currentUserId }: Props) => {
  const isMine = message.senderId === currentUserId
  const isMedia = message.type === 'MEDIA'

  const renderMedia = () => {
    return (
      <div className='d-flex flex-wrap gap-2'>
        {message.mediaUrls?.map((url, index) => {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
          const isVideo = /\.(mp4|webm|ogg)$/i.test(url)

          if (isImage) {
            return (
              <img
                key={index}
                src={url}
                alt={`media-${index}`}
                className='img-fluid rounded'
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
              />
            )
          } else if (isVideo) {
            return (
              <video
                key={index}
                controls
                className='rounded'
                style={{ maxWidth: '250px', maxHeight: '250px', backgroundColor: '#000' }}
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
