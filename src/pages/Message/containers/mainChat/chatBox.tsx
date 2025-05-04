import { useEffect, useRef, useState } from 'react'
import { Conversation, Message } from 'src/types/message.type'
import MessageItem from './message'
import { useChatWebSocket } from 'src/features/chat/useChatWebSocket'
import { UserDTO } from 'src/types/user.type'
import StickerPicker from 'src/components/chat/StickerPicker '
import messageAPI from 'src/apis/message.api'

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

  const getConversationHeader = () => {
    if (!selectedConversation) return { name: '', avatar: '' }

    if (selectedConversation.type === 'GROUP') {
      return {
        name: selectedConversation.name,
        avatar: selectedConversation.avatar
      }
    }

    // PRIVATE: tìm partner khác currentUserId
    const partner = selectedConversation.users.find((u) => u.userId !== currentUserId)

    return {
      name: partner?.displayName || 'Unknown',
      avatar: partner?.avatar || null
    }
  }

  const { name: headerName, avatar: headerAvatar } = getConversationHeader()

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      try {
        const res = await messageAPI.getMessages(selectedConversation.id)
        const data = res.data
        setMessages(data)
      } catch (err) {
        console.error('Fetch messages error:', err)
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
                  mediaUrls: [] // xóa media nếu có
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

    try {
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append('file', file)

          const token = localStorage.getItem('accessToken')
          const res = await fetch('http://localhost:8080/ola-chat/files/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token || ''}`
            },
            body: formData
          })

          const data = await res.json()
          mediaUrls.push(data.fileUrl)
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
    }
  }

  const handleRecallMessage = (messageId: string) => {
    recallMessage(messageId, currentUserId)

    // setMessages((prevMessages) =>
    //   prevMessages.map((msg) =>
    //     msg.id === messageId ? { ...msg, content: 'Tin nhắn đã thu hồi', isRecalled: true } : msg
    //   )
    // )
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
    return selectedFiles.map((file, index) => {
      const url = URL.createObjectURL(file)
      const isImage = file.type.startsWith('image')
      const isVideo = file.type.startsWith('video')

      return (
        <div key={index} className='position-relative d-inline-block me-2 mb-2 h-full' style={{ width: '100px' }}>
          {isImage ? (
            <img src={url} alt='preview' style={{ height: '100px', borderRadius: '10px', objectFit: 'cover' }} />
          ) : isVideo ? (
            <video src={url} controls style={{ height: '100px', borderRadius: '10px' }} />
          ) : (
            <p>Unsupported</p>
          )}
          <button
            type='button'
            onClick={() => removeSelectedFile(index)}
            className='btn btn-sm btn-danger position-absolute top-0 end-0'
          >
            ✕
          </button>
        </div>
      )
    })
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

  return (
    <>
      {selectedConversation ? (
        <div className='chat-area flex-grow-1 d-flex flex-column bg-light' style={{ maxWidth: '600px', width: '100%' }}>
          <div className='px-4 py-2 bg-white border-bottom d-flex align-items-center gap-2'>
            <img
              src={
                headerAvatar ||
                'https://static.vecteezy.com/system/resources/previews/026/434/409/non_2x/default-avatar-profile-icon-social-media-user-photo-vector.jpg'
              }
              alt='avatar'
              className='rounded-circle'
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
              {headerName}
            </p>
          </div>

          <div
            className='chat-messages flex-grow-1 p-4 overflow-auto flex flex-col gap-2'
            style={{ maxHeight: '400px' }}
          >
            {messages.map((message, index) => (
              <MessageItem
                key={message.id || `${message.senderId}-${index}`}
                message={message}
                currentUserId={currentUserId}
                users={selectedConversation?.users || []}
                conversationType={(selectedConversation?.type as 'PRIVATE' | 'GROUP') || 'PRIVATE'}
                onRecall={handleRecallMessage}
              />
            ))}
            {/* <div ref={bottomRef} />  */}
          </div>

          <div className='chat-input px-4 py-3 bg-white border-top'>
            <form onSubmit={handleSendMessage}>
              {selectedFiles.length > 0 && <div className='mb-2 d-flex flex-wrap'>{renderFilePreview()}</div>}

              <div className='d-flex align-items-center gap-2'>
                <button
                  type='button'
                  className='btn btn-light m-0 px-2 py-1'
                  title='Chọn sticker'
                  onClick={() => setShowStickerPicker(true)}
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
                  />
                </label>

                <input
                  type='text'
                  className='form-control bg-light border-0 rounded-pill'
                  placeholder='Message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ fontSize: '14px', height: '40px' }}
                />

                <button
                  type='submit'
                  className='btn text-white rounded-circle'
                  style={{ backgroundColor: '#4F46E5', width: '40px', height: '40px' }}
                >
                  <i className='fas fa-paper-plane'></i>
                </button>
              </div>
            </form>
          </div>

          {showStickerPicker && (
            <StickerPicker onSelect={(url) => sendStickerMessage(url)} onClose={() => setShowStickerPicker(false)} />
          )}
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
