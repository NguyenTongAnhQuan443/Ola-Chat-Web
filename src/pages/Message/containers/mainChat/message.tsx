import { Message } from 'src/types/message.type'

interface Props {
  message: Message
  currentUserId: string
}

const MessageItem = ({ message, currentUserId }: Props) => {
  const isMine = message.senderId === currentUserId
  const isMedia = message.type === 'IMAGE' || message.type === 'VIDEO'

  const render = () => {
    if (message.type === 'TEXT') {
      if (message.recalled) {
        return <p className='mb-0'>Tin nhắn đã được thu hồi</p>
      }
      return <p className='mb-0'>{message.content}</p>
    } else if (message.type === 'IMAGE' && message.mediaUrl) {
      return <img src={message.mediaUrl} className='img-fluid rounded' style={{ padding: '0', border: 'none' }} />
    } else if (message.type === 'VIDEO' && message.mediaUrl) {
      return (
        <video controls className='img-fluid rounded' style={{ maxHeight: '300px' }}>
          <source src={message.mediaUrl} type='video/mp4' />
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      )
    } else {
      return <p className='mb-0 text-muted'>Không hỗ trợ loại tin nhắn này</p>
    }
  }

  if (message.recalled) {
    return (
      <div className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'} my-2`}>
        <div className='text-muted small p-2 bg-light rounded shadow-sm'>Tin nhắn đã được thu hồi</div>
      </div>
    )
  }

  return (
    <div className={`d-flex flex-column ${isMine ? 'align-items-end' : 'align-items-start'} my-2`}>
      <div
        className={`rounded-3 shadow-sm ${isMine ? 'bg-indigo-500 text-white' : 'bg-light text-dark'} ${isMedia ? 'p-0' : 'p-3'}`}
        style={{
          maxWidth: '60%',
          backgroundColor: isMine ? '#4F46E5' : '#f1f1f1'
        }}
      >
        {render()}
      </div>
      <div className='text-muted small' style={{ fontSize: '0.75rem', marginTop: '5px' }}>
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default MessageItem
