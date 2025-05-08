import { useContext, useEffect, useState } from 'react'
import { UserDTO } from 'src/types/user.type'
import { Conversation, Message, Participant } from 'src/types/message.type'
import { AppContext } from 'src/contexts/app.context'
import messageAPI from 'src/apis/message.api'
import { get, set } from 'lodash'

interface Props {
  onPress: (conversationId: Conversation) => void
}

const Conversations = ({ onPress }: Props) => {
  const { profile } = useContext(AppContext)

  const [conversations, setConversations] = useState<Conversation[]>([])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [unreadMap, setUnreadMap] = useState<{ [key: string]: number }>({})

  const sortConversationsByDate = (conversations: Conversation[]) => {
    return [...conversations].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
      const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
      return dateB - dateA
    })
  }

  async function getConversations() {
    try {
      const response = await messageAPI.getConversations(profile?.userId)
      const data = response.data.data
      const sortedData = sortConversationsByDate(data)

      setConversations(sortedData)
      setSelectedConversation(data[0])
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  }

  // Lấy danh sách cuộc trò chuyện từ API
  useEffect(() => {
    const fetchConversations = async () => {
      await getConversations()
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (conversations.length > 0 && profile) {
      const conversationIds = conversations.map((c) => c.id)

      const handleMessageReceived = (conversationId: string, message: any) => {
        // Update unread count if this isn't the selected conversation
        if (conversationId !== selectedConversation?.id) {
          setUnreadMap((prev) => ({
            ...prev,
            [conversationId]: (prev[conversationId] || 0) + 1
          }))
        }

        // Update the lastMessage in conversations and resort
        setConversations((prevConversations) => {
          // First update the lastMessage for the conversation
          const updatedConversations = prevConversations.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  content: message.content,
                  createdAt: new Date().toISOString(),
                  senderId: message.senderId,
                  type: message.type // Thêm type để xử lý hiển thị hình ảnh, sticker, etc.
                }
              }
            }
            return conv
          })

          // Then sort the conversations based on lastMessage date
          return sortConversationsByDate(updatedConversations)
        })
      }

      messageAPI.connectToWebSocket(conversationIds, handleMessageReceived)
    }

    return () => {
      messageAPI.disconnectWebSocket()
    }
  }, [conversations, profile, selectedConversation?.id])

  const getPartner = async (conversationId: string): Promise<Participant | undefined> => {
    try {
      const res = await messageAPI.getParticipants(conversationId)
      const data = res.data
      const partner = data.find((participant) => participant.userId !== profile?.userId)
      return partner
    } catch (err) {
      console.error('Fetch participants error:', err)
      return undefined
    }
  }

  useEffect(() => {
    const fetchPartners = async () => {
      for (const conversation of conversations) {
        if (conversation.type === 'PRIVATE' && !conversation.partner) {
          const partner = await getPartner(conversation.id);
          if (partner) {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === conversation.id ? {...conv, partner} : conv
              )
            );
          }
        }
      }
    };
    
    fetchPartners();
  }, [conversations]);

  const handleConversationSelect = (conversation: Conversation) => {
    const con = conversations.find((conv) => conv.id === conversation.id)
    setSelectedConversation(con || null)

    // Reset số tin nhắn chưa đọc khi chọn cuộc trò chuyện
    setUnreadMap((prev) => ({
      ...prev,
      [conversation.id]: 0
    }))

    onPress(conversation)
  }

  return (
    <>
      <div className='chat-list border-end' style={{ width: '100%', maxWidth: '268px' }}>
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
              className={`chat-item px-3 py-2 border-bottom ${selectedConversation?.id === conversation.id ? 'bg-light' : 'bg-[#F1F4F9]'}`}
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => handleConversationSelect(conversation)}
            >
              {/* Hiển thị avatar và tên người dùng hoặc tên nhóm */}

              <div className='d-flex align-items-start position-relative'>
                <img
                  src={
                    conversation.type === 'GROUP'
                      ? conversation.avatar || '/default-group.png'
                      : conversation.partner?.avatar || '/default-avatar.png'
                  }
                  alt='Avatar'
                  className='rounded-circle me-3'
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <div className='flex-grow-1 overflow-hidden'>
                  <p className='mb-1 text-dark fw-semibold' style={{ fontSize: '15px' }}>
                    {conversation.type === 'GROUP'
                      ? conversation.name || 'Nhóm không tên'
                      : conversation.partner?.displayName || 'Người dùng ẩn danh'}
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

                {/* Hiển thị badge số tin nhắn chưa đọc */}
                {unreadMap[conversation.id] > 0 && (
                  <span
                    className='badge bg-primary rounded-pill position-absolute'
                    style={{ top: '10px', right: '5px' }}
                  >
                    {unreadMap[conversation.id]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='new-message-section border-top px-4 py-3 bg-white' style={{ position: 'sticky', bottom: 0 }}>
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
