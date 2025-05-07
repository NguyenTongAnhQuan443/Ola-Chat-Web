import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { Conversation, Message } from 'src/types/message.type'
import MessageItem from './message'
import { useChatWebSocket } from 'src/features/chat/useChatWebSocket'
import { UserDTO } from 'src/types/user.type'
import StickerPicker from 'src/components/chat/StickerPicker '
import messageAPI from 'src/apis/message.api'
import fileAPI from 'src/apis/file.api'
import { IoClose } from 'react-icons/io5'
import { FaBars, FaUserPlus, FaUserMinus, FaTrash, FaUserShield } from 'react-icons/fa'
import { toast } from 'react-toastify'
import AddGroupMemberModal from './AddGroupMemberModal'
import { profile } from 'console'
import GroupInfoSidebar from './GroupInfoSidebar'

interface Props {
  selectedConversation: Conversation | null
  currentUserId: string
  listUser?: UserDTO[]
}

const ChatBox = ({ selectedConversation, currentUserId }: Props) => {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const previousMessagesLength = useRef<number>(0)

  const getConversationHeader = () => {
    if (!selectedConversation) return { name: '', avatar: '' }

    if (selectedConversation.type === 'GROUP') {
      return {
        name: selectedConversation.name,
        avatar: selectedConversation.avatar
      }
    }

    const partner = selectedConversation.participants.find((u) => u.userId !== currentUserId)

    return {
      name: partner?.displayName || 'Unknown',
      avatar: partner?.avatar || null
    }
  }

  const { name: headerName, avatar: headerAvatar } = getConversationHeader()

  useLayoutEffect(() => {
    if (!isLoadingMessages && messages.length > previousMessagesLength.current) {
      const container = messagesContainerRef.current
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200

        if (isNearBottom) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' })
      }
    }

    previousMessagesLength.current = messages.length
  }, [messages, isLoadingMessages])

  useEffect(() => {
    if (selectedConversation) {
      setIsLoadingMessages(true)
    }
  }, [selectedConversation])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return
      try {
        setIsLoadingMessages(true)

        const res = await messageAPI.getMessages(selectedConversation.id)
        const data = res.data
        setMessages(data)

        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'auto' })
          setIsLoadingMessages(false)
        }, 150)
      } catch (err) {
        console.error('Fetch messages error:', err)
        setIsLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [selectedConversation])

  const { sendMessage, recallMessage } = useChatWebSocket({
    destination: selectedConversation ? `/user/${selectedConversation.id}/private` : '',
    onMessage: (msg) => {
      if (msg.recalled) {
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m.id === msg.id
              ? {
                  ...m,
                  recalled: true,
                  content: 'Tin nhắn đã thu hồi',
                  mediaUrls: []
                }
              : m
          )
        )
      } else {
        setMessages((prevMessages) => [...prevMessages, msg])
      }
    }
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!selectedConversation) return

    let mediaUrls: string[] = []
    setIsUploading(true)

    try {
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const responses = await fileAPI.uploadMultiple(selectedFiles)

          mediaUrls = responses.map((response) => response.data.fileUrl)
        }
      }

      const messageDTO = {
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        content: newMessage,
        type: mediaUrls.length > 0 ? 'MEDIA' : 'TEXT',
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : null
      }

      sendMessage(messageDTO)

      setNewMessage('')
      setSelectedFiles([])
    } catch (err) {
      console.error('Upload/send error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRecallMessage = (messageId: string) => {
    recallMessage(messageId, currentUserId)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const renderFilePreview = () => {
    if (selectedFiles.length === 0) return null

    return (
      <div
        className='file-preview-container position-absolute bottom-100 start-0 end-0 p-2 d-flex align-items-center'
        style={{
          minHeight: '70px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          zIndex: 10,
          backgroundColor: 'rgba(33, 37, 41, 0.6)'
        }}
      >
        <div className='d-flex align-items-center overflow-auto pe-2' style={{ maxWidth: '90%' }}>
          {selectedFiles.map((file, index) => {
            const url = URL.createObjectURL(file)
            const isImage = file.type.startsWith('image')

            return (
              <div key={index} className='position-relative me-2' style={{ minWidth: '50px' }}>
                {isImage ? (
                  <img
                    src={url}
                    alt='preview'
                    className='rounded'
                    style={{ height: '45px', width: '45px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className='bg-secondary rounded d-flex align-items-center justify-content-center'
                    style={{ height: '45px', width: '45px' }}
                  >
                    <i className='fas fa-file text-white'></i>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button type='button' className='btn btn-sm text-white ms-auto' onClick={() => setSelectedFiles([])}>
          <IoClose size={24} />
        </button>
      </div>
    )
  }

  const sendStickerMessage = (stickerUrl: string) => {
    if (!selectedConversation) return

    const messageDTO = {
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content: '',
      type: 'STICKER',
      mediaUrls: [stickerUrl]
    }

    sendMessage(messageDTO)
  }

  const handleMembersAdded = () => {
    // Cập nhật lại conversation sau khi thêm thành viên
    if (selectedConversation) {
      // Fetch lại conversation từ API
      const fetchConversation = async () => {
      try {
        const response = await messageAPI.getConversations(currentUserId);
        if (response.data) {
        // Cập nhật selected conversation trong parent component
        // Giả định có hàm setter từ props hoặc cập nhật thông qua context
        // Ví dụ: setSelectedConversation(response.data);
        
        // Nếu không có setter từ props, có thể dispatch một event
        const event = new CustomEvent('conversationUpdated', {
          detail: { conversation: response.data }
        });
        window.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Failed to refresh conversation:', error);
      }
      };
      
      fetchConversation();
    }
    toast.success('Đã thêm thành viên vào nhóm')
  }

  return (
    <>
      {selectedConversation ? (
        <div className='chat-area flex-grow-1 d-flex flex-column bg-light' style={{ width: '100%', position: 'relative' }}>
          <div className='px-4 py-2 bg-white border-bottom d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center gap-2'>
              <img
                src={
                  headerAvatar ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                }
                alt='avatar'
                className='rounded-circle'
                style={{ width: '40px', height: '42px', objectFit: 'cover' }}
              />
              <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                {headerName}
              </p>
            </div>
            
            {/* Thêm nút hiển thị thông tin nhóm */}
            {selectedConversation.type === 'GROUP' && (
              <button 
                className='btn btn-light btn-sm' 
                onClick={() => setShowGroupInfo(prev => !prev)}
              >
                <FaBars />
              </button>
            )}
          </div>

          {/* Sử dụng component GroupInfoSidebar */}
          {selectedConversation.type === 'GROUP' && (
            <GroupInfoSidebar 
              show={showGroupInfo}
              onHide={() => setShowGroupInfo(false)}
              conversation={selectedConversation}
              onAddMember={() => setShowAddMemberModal(true)}
              currentUserId={currentUserId}
              isAdmin={selectedConversation.participants.some(
                participant => participant.userId === currentUserId && participant.role === 'ADMIN'
              )}
            />
          )}
          
          <div
            ref={messagesContainerRef}
            className='chat-messages flex-grow-1 p-4 overflow-auto flex flex-col gap-2 bg-white position-relative'
            style={{ height: 'calc(100vh - 160px)' }}
          >
            {isLoadingMessages && (
              <div
                className='position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center'
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 2 }}
              >
                <div className='spinner-border' role='status' style={{ color: '#f1f4f9' }}>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <MessageItem
                key={message.id || `${message.senderId}-${index}`}
                message={message}
                currentUserId={currentUserId}
                participants={selectedConversation?.participants || []}
                conversationType={(selectedConversation?.type as 'PRIVATE' | 'GROUP') || 'PRIVATE'}
                onRecall={handleRecallMessage}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className='chat-input px-4 py-3 bg-white border-top position-relative'>
            {selectedFiles.length > 0 && renderFilePreview()}

            <form onSubmit={handleSendMessage}>
              <div className='d-flex align-items-center gap-2'>
                <button
                  type='button'
                  className='btn btn-light m-0 px-2 py-1'
                  title='Chọn sticker'
                  onClick={() => setShowStickerPicker(true)}
                  disabled={isUploading}
                >
                  🧸
                </button>

                <label className='btn btn-light m-0 px-2 py-1' title='Chọn file'>
                  <i className='fas fa-paperclip'></i>
                  <input
                    type='file'
                    accept='image/*,video/*'
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>

                <input
                  type='text'
                  className='form-control bg-light border-0 rounded-pill'
                  placeholder='Message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ fontSize: '14px', height: '40px' }}
                  disabled={isUploading}
                />

                <button
                  type='submit'
                  className='btn text-white rounded-circle'
                  style={{ backgroundColor: '#4F46E5', width: '40px', height: '40px' }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                  ) : (
                    <i className='fas fa-paper-plane'></i>
                  )}
                </button>
              </div>
            </form>
          </div>

          {showStickerPicker && (
            <StickerPicker onSelect={(url) => sendStickerMessage(url)} onClose={() => setShowStickerPicker(false)} />
          )}

          {/* Modal thêm thành viên */}
          {selectedConversation && selectedConversation.type === 'GROUP' && (
            <AddGroupMemberModal
              show={showAddMemberModal}
              onHide={() => setShowAddMemberModal(false)}
              conversationId={selectedConversation.id}
              currentMembers={selectedConversation.participants.map(participant => participant.userId)}
              onMembersAdded={handleMembersAdded}
            />
          )}
        </div>
      ) : (
        <div
          className='chat-area flex-grow-1 d-flex flex-column justify-content-center align-items-center'
          style={{ height: '100%' }}
        >
          <div className='d-flex flex-column align-items-center text-center' style={{ maxWidth: '300px' }}>
            <div className='mb-3'>
              <svg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M45 17.5H15C13.6193 17.5 12.5 18.6193 12.5 20V40C12.5 41.3807 13.6193 42.5 15 42.5H45C46.3807 42.5 47.5 41.3807 47.5 40V20C47.5 18.6193 46.3807 17.5 45 17.5Z'
                  stroke='#6B7280'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12.5 25L29.1716 33.3358C29.6913 33.5955 30.3087 33.5955 30.8284 33.3358L47.5 25'
                  stroke='#6B7280'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <h5 className='mb-3'>Your messages</h5>
            <p className='text-muted mb-4' style={{ whiteSpace: 'nowrap' }}>
              Select a person to display their chat or start a new conversation.
            </p>
            <button className='btn btn-primary rounded-pill px-4'>New message</button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBox
