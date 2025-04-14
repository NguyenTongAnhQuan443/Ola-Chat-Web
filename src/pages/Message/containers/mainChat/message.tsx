import { Message } from 'src/types/message.type'

interface Props {
  message: Message
  currentUserId: string
}

const MessageItem = ({ message, currentUserId }: Props) => {
  const isMine = message.senderId === currentUserId

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
        className={`p-3 rounded-3 shadow-sm ${isMine ? 'bg-indigo-500 text-white' : 'bg-light text-dark'}`}
        style={{
          maxWidth: '60%',
          backgroundColor: isMine ? '#4F46E5' : '#f1f1f1' // Change background color
        }}
      >
        {message.type === 'TEXT' ? (
          <p className='mb-0'>{message.content}</p>
        ) : message.mediaUrl ? (
          <img src={message.mediaUrl} alt='media' className='img-fluid rounded' />
        ) : (
          <p className='mb-0 text-muted'>Không hỗ trợ loại tin nhắn này</p>
        )}
      </div>
      <div className='text-muted small' style={{ fontSize: '0.75rem', marginTop: '5px' }}>
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default MessageItem
