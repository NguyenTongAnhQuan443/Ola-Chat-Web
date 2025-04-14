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
    // Connect to WebSocket and listen for new messages for all conversations
    conversations.forEach((conversation) => {
      connectToWebSocket(conversation.id)
    })

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [conversations])

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
      // console.log('data', data)

      setCurrentUser(data.data)
      getConversations(data.data.userId)

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

  const connectToWebSocket = (conversationId: string) => {
    const socket = new SockJS('http://localhost:8080/ola-chat/ws')
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      }
    })

    stompClient.current.onConnect = () => {
      console.log('Connected to WebSocket')

      stompClient.current?.subscribe(
        `/user/${conversationId}/private`, // đường dẫn từ backend
        (message) => {
          const newMsg = JSON.parse(message.body)
          console.log('📥 Nhận tin nhắn:', newMsg)

          // Cập nhật lại tin nhắn mới cho đúng conversation
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === conversationId
                ? { ...conv, lastMessage: newMsg } // Cập nhật lastMessage cho conversation
                : conv
            )
          )
        }
      )
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

        <div className='chat-list-content'>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`d-flex align-items-center px-4 py-3 border-bottom chat-item
                ${selectedConversation?.id === conversation.id ? 'bg-light' : ''}`}
              onClick={(e) => handleConversationSelect(conversation.id)}
            >
              <div className='position-relative d-flex align-items-center'>
                <img
                  src={getPartner(conversation)?.avatar}
                  alt='Chat partner'
                  className='rounded-circle me-3'
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <p className='mb-0 text-dark' style={{ fontSize: '14px', fontWeight: 500 }}>
                  {getPartner(conversation)?.displayName || 'Người dùng ẩn danh'}
                </p>
              </div>
              <div className='ms-3 overflow-hidden'>
                <p
                  className='mb-0 text-dark'
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    maxWidth: '50px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {conversation.lastMessage?.content}
                </p>
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
