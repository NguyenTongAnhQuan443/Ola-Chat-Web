import { useState } from 'react'
import { User } from 'src/types/user.type'

const ChatBox = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [partner, setPartner] = useState<{ name: string; avatar: string } | null>(null)
  return (
    <div>
      {selectedConversation ? (
        <div className='chat-area flex-grow-1 d-flex flex-column bg-light' style={{ maxWidth: '600px', width: '100%' }}>
          <div className='px-4 py-3 bg-white border-bottom'>
            <div className='d-flex align-items-center'>
              <img
                src={partner?.avatar}
                alt='Chat partner'
                className='rounded-circle'
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <div className='ms-3'>
                <p className='mb-0' style={{ fontSize: '14px', fontWeight: 500 }}>
                  {partner?.name || 'Người dùng ẩn danh'}
                </p>
                <span className='text-muted' style={{ fontSize: '13px' }}>
                  {selectedConversation.type}
                </span>
              </div>
            </div>
          </div>

          <div className='chat-messages flex-grow-1 p-4 overflow-auto'>
            <div className='chat-input px-4 py-3 bg-white border-top'>
              {/* <form onSubmit={handleSendMessage}> */}
              <div className='position-relative d-flex align-items-center'>
                <input
                  type='text'
                  className='form-control bg-light border-0 rounded-pill'
                  placeholder='Message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    fontSize: '14px',
                    paddingRight: '40px',
                    height: '40px'
                  }}
                />
                <button
                  type='submit'
                  className='btn position-absolute end-0 top-50 translate-middle-y me-2'
                  style={{ color: '#4F46E5' }}
                >
                  <i className='fas fa-paper-plane'></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='chat-area flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
          <p className='text-muted'>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  )
}
export default ChatBox
