import { useEffect, useState } from 'react'
import { Message } from 'src/types/message.type'
import MessageItem from './message'
import { Client } from '@stomp/stompjs'

interface Props {
  selectedConversationID: string | null
  currentUserId: string
}

const ChatBox = ({ selectedConversationID, currentUserId }: Props) => {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [stompClient, setStompClient] = useState<Client | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationID) return

      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found in localStorage')
        return
      }

      try {
        const response = await fetch(
          `http://localhost:8080/ola-chat/api/conversations/${selectedConversationID}/messages`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Messages:', data)
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [selectedConversationID])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // TODO: Gửi message tới WebSocket hoặc API ở đây
    console.log('Sending message:', newMessage)

    setNewMessage('')
  }

  return (
    <>
      {selectedConversationID ? (
        <div className='chat-area flex-grow-1 d-flex flex-column bg-light' style={{ maxWidth: '600px', width: '100%' }}>
          <div className='px-4 py-3 bg-white border-bottom'>
            <h5 className='mb-0'>Conversation</h5>
          </div>

          <div className='chat-messages flex-grow-1 p-4 overflow-auto flex flex-col gap-2'>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} currentUserId={currentUserId} />
            ))}
          </div>

          <div className='chat-input px-4 py-3 bg-white border-top'>
            <form onSubmit={handleSendMessage}>
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
            </form>
          </div>
        </div>
      ) : (
        <div className='chat-area flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
          <p className='text-muted'>Select a conversation to start chatting</p>
        </div>
      )}
    </>
  )
}

export default ChatBox
