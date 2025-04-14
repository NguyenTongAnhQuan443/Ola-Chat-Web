import { useEffect, useRef, useState } from 'react'
import { User, UserDTO } from 'src/types/user.type'
import { useSearchParams } from 'react-router-dom'
import { log } from 'console'
import { forEach } from 'lodash'
import { Conversation, Message } from 'src/types/message.type'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface Props {
  onPress: (conversationId: string) => void
}

const Conversations = ({ onPress }: Props) => {
  const [searchParams] = useSearchParams()
  const conversationId = searchParams.get('conversationId')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null)
  const stompClient = useRef<Client | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      await getMyInfo()
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (conversations.length > 0 && currentUser) {
      const conversationIds = conversations.map((c) => c.id)
      connectToWebSocket(conversationIds) // ✅ Gửi danh sách ID một lần
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [conversations, currentUser])

  async function getMyInfo() {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    try {
      const response = await fetch('http://localhost:8080/ola-chat/users/my-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setCurrentUser(data.data)
      await getConversations(data.data.userId) // <-- Đợi fetch xong rồi setConversations

      return data.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  async function getConversations(userId?: string) {
    const accessToken = localStorage.getItem('accessToken')
    // console.log('currentUser', currentUser)

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    try {
      const response = await fetch(`http://localhost:8080/ola-chat/api/conversations?userId=${userId ?? ''}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      // console.log('Conversations: ', data)

      setConversations(data)
      setSelectedConversation(data[0])

      return data.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  const getPartner = (conversation: Conversation) => {
    const partner = conversation.users.find((user) => user.userId !== currentUser?.userId)
    return partner
  }

  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find((conv) => conv.id === conversationId)
    setSelectedConversation(conversation || null)
    onPress(conversationId) // Call onPress to handle WebSocket in ChatBox
  }

  const connectToWebSocket = (conversationIds: string[]) => {
    const socket = new SockJS('http://localhost:8080/ola-chat/ws')
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str)
      }
    })

    stompClient.current.onConnect = () => {
      console.log('Connected to WebSocket')

      conversationIds.forEach((conversationId) => {
        stompClient.current?.subscribe(`/user/${conversationId}/private`, (message) => {
          const newMsg = JSON.parse(message.body)
          console.log('📥 Nhận tin nhắn mới:', newMsg)

          // Tải lại danh sách conversation khi có tin nhắn mới
          getConversations(currentUser?.userId)
        })
      })
    }

    stompClient.current.activate()
  }

  return (
    <>
      {/* Conversations List */}
      <div className='chat-list border-end' style={{ maxWidth: '320px' }}>
        <div className='d-flex justify-content-between align-items-center px-4 py-3 border-bottom'>
          <h6 className='mb-0'>Messages</h6>
          <div className='d-flex align-items-center gap-3'>
            <span className='text-muted' style={{ fontSize: '13px' }}>
              Online
            </span>
            <button className='btn btn-link text-dark p-0'>
              <i className='fas fa-ellipsis-h'></i>
            </button>
          </div>
        </div>

        <div className='chat-list-content' style={{ textAlign: 'left' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-item px-3 py-2 border-bottom ${selectedConversation?.id === conversation.id ? 'bg-light' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <div className='d-flex align-items-start'>
                <img
                  src={getPartner(conversation)?.avatar}
                  alt='Chat partner'
                  className='rounded-circle me-3'
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <div className='flex-grow-1 overflow-hidden'>
                  <p className='mb-1 text-dark fw-semibold' style={{ fontSize: '15px' }}>
                    {getPartner(conversation)?.displayName || 'Người dùng ẩn danh'}
                  </p>
                  <p
                    className='mb-0 text-muted'
                    style={{
                      fontSize: '13px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '180px'
                    }}
                  >
                    {conversation.lastMessage?.content || '...'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='new-message-section border-top px-4 py-3 bg-white'>
          <div className='d-flex align-items-center text-muted' style={{ fontSize: '14px', cursor: 'pointer' }}>
            <i className='far fa-edit me-2'></i>
            New Message
          </div>
        </div>
      </div>
    </>
  )
}

export default Conversations
