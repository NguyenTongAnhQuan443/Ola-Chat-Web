import { useEffect, useRef, useState } from 'react'
import { UserDTO } from 'src/types/user.type'
import { useSearchParams } from 'react-router-dom'
import { Conversation, Message } from 'src/types/message.type'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { set } from 'lodash'

interface Props {
  onPress: (conversationId: Conversation) => void
}

const Conversations = ({ onPress }: Props) => {
  const [searchParams] = useSearchParams()
  const conversationId = searchParams.get('conversationId')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null)
  const stompClient = useRef<Client | null>(null)
  const [unreadMap, setUnreadMap] = useState<{ [key: string]: number }>({})
  const [listUser, setListUser] = useState<UserDTO[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      await getMyInfo()
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (conversations.length > 0 && currentUser) {
      const conversationIds = conversations.map((c) => c.id)
      connectToWebSocket(conversationIds)
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [conversations, currentUser])

  async function getMyInfo() {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) throw new Error('Access token not found in localStorage')

    try {
      const response = await fetch('http://localhost:8080/ola-chat/users/my-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      setCurrentUser(data.data)
      await getConversations(data.data.userId)

      return data.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  async function getConversations(userId?: string) {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) throw new Error('Access token not found in localStorage')

    try {
      const response = await fetch(`http://localhost:8080/ola-chat/api/conversations?userId=${userId ?? ''}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

      const data = await response.json()
      setConversations(data)
      setSelectedConversation(data[0])
      setListUser(data[0]?.users || [])
      return data.data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  }

  const getPartner = (conversation: Conversation) => {
    const partner = conversation.users.find((user) => user.userId !== currentUser?.userId)
    return partner
  }

  const handleConversationSelect = (conversation: Conversation) => {
    const con = conversations.find((conv) => conv.id === conversation.id)
    setSelectedConversation(con || null)
    setListUser(con?.users || [])

    onPress(conversation)
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

          // ✅ Nếu không phải convo đang mở → tăng số chưa đọc
          if (conversationId !== selectedConversation?.id) {
            setUnreadMap((prev) => ({
              ...prev,
              [conversationId]: (prev[conversationId] || 0) + 1
            }))
          }

          console.log('UNREAD MAP', unreadMap)

          getConversations(currentUser?.userId)
        })
      })
    }

    stompClient.current.activate()
  }

  return (
    <>
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
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => handleConversationSelect(conversation)}
            >
              <div className='d-flex align-items-start position-relative'>
                <img
                  src={
                    conversation.type === 'GROUP'
                      ? conversation.avatar || '/default-group.png'
                      : getPartner(conversation)?.avatar || '/default-avatar.png'
                  }
                  alt='Avatar'
                  className='rounded-circle me-3'
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <p className='mb-1 text-dark fw-semibold' style={{ fontSize: '15px' }}>
                  {conversation.type === 'GROUP'
                    ? conversation.name || 'Nhóm không tên'
                    : getPartner(conversation)?.displayName || 'Người dùng ẩn danh'}
                </p>

                {/* 🔴 Badge nếu có tin chưa đọc */}
                {unreadMap[conversation.id] > 0 && (
                  <span
                    className='badge bg-danger text-white rounded-circle position-absolute top-0 end-0'
                    style={{
                      fontSize: '11px',
                      width: '20px',
                      height: '20px',
                      lineHeight: '20px',
                      textAlign: 'center',
                      transform: 'translate(30%, -30%)'
                    }}
                  >
                    {unreadMap[conversation.id]}
                  </span>
                )}
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
