import { useEffect, useRef, useState, useLayoutEffect, useContext } from 'react'
import { Conversation, Message, Participant } from 'src/types/message.type'
import MessageItem from './message'
import StickerPicker from 'src/components/chat/StickerPicker '
import messageAPI from 'src/apis/message.api'
import fileAPI from 'src/apis/file.api'
import { IoClose } from 'react-icons/io5'
import { FaBars } from 'react-icons/fa'
import { toast } from 'react-toastify'
import AddGroupMemberModal from './AddGroupMemberModal'
import GroupInfoSidebar from './GroupInfoSidebar'
import { useWebSocket } from 'src/contexts/websocket.context'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import ForwardMessageModal from 'src/components/chat/ForwardMessageModal'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  currentUserId: string
}

const ChatBox = ({ currentUserId }: Props) => {
  const { refreshConversations, selectedConversation, setSelectedConversation } = useContext(AppContext)
  const [newMessage, setNewMessage] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [messageToForward, setMessageToForward] = useState<Message | null>(null)

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const previousMessagesLength = useRef<number>(0)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { subscribe, unsubscribe, publishMessage, recallMessage } = useWebSocket()
  const subscriptionIdRef = useRef<string | null>(null)

  const getConversationHeader = () => {
    if (!selectedConversation) return { name: '', avatar: '' }

    if (selectedConversation.type === 'GROUP') {
      return {
        name: selectedConversation.name,
        avatar: selectedConversation.avatar
      }
    }

    const partner = participants.find((u) => u.userId !== currentUserId)

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
    const fetchParticipants = async () => {
      if (!selectedConversation) return
      try {
        const res = await messageAPI.getParticipants(selectedConversation.id)
        const data = res.data
        setParticipants(data)
      } catch (err) {
        console.error('Fetch participants error:', err)
      }
    }

    fetchParticipants()
  }, [selectedConversation])

  useEffect(() => {
    // Reset states when conversation changes
    setMessages([])
    setNewMessage('')
    setSelectedFiles([])

    // Wait for participants to be loaded before fetching messages
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true)
        if (!selectedConversation) return
        const res = await messageAPI.getMessages(selectedConversation.id)
        const data = res.data
        setMessages(data)

        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'auto' })
          setIsLoadingMessages(false) // Reset loading state ngay sau khi scroll
        })
      } catch (err) {
        console.error('Fetch messages error:', err)
        setIsLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [selectedConversation])

  // Đăng ký nhận tin nhắn khi selectedConversation thay đổi
  useEffect(() => {
    if (!selectedConversation) return

    // Hủy subscription cũ nếu có
    if (subscriptionIdRef.current) {
      unsubscribe(subscriptionIdRef.current)
    }

    // Đăng ký subscription mới
    const destination = `/user/${selectedConversation.id}/private`
    const subId = subscribe(destination, handleReceivedMessage)
    subscriptionIdRef.current = subId

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current)
      }
    }
  }, [selectedConversation, subscribe, unsubscribe])

  // Xử lý khi nhận được tin nhắn mới
  const handleReceivedMessage = (msg: any) => {
    msg['createdAt'] = new Date().toISOString()
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

  // Gửi tin nhắn: text, media, system
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

      publishMessage('/app/private-message', messageDTO)

      setNewMessage('')
      setSelectedFiles([])
    } catch (err) {
      console.error('Upload/send error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  // Xử lý thu hồi tin nhắn
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
            const isVideo = file.type.startsWith('video')
            const isPdf = file.type === 'application/pdf'
            const isDoc =
              file.type === 'application/msword' ||
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

            return (
              <div key={index} className='position-relative me-2' style={{ minWidth: '50px' }}>
                {isImage ? (
                  <img
                    src={url}
                    alt='preview'
                    className='rounded'
                    style={{ height: '45px', width: '45px', objectFit: 'cover' }}
                  />
                ) : isVideo ? (
                  <video
                    src={url}
                    className='rounded'
                    style={{ height: '45px', width: '45px', objectFit: 'cover' }}
                    muted
                    autoPlay
                    loop
                  />
                ) : isPdf ? (
                  <div
                    className='bg-danger rounded d-flex align-items-center justify-content-center'
                    style={{ height: '45px', width: '45px' }}
                    title={file.name}
                  >
                    <i className='fas fa-file-pdf text-white'></i>
                  </div>
                ) : isDoc ? (
                  <div
                    className='bg-primary rounded d-flex align-items-center justify-content-center'
                    style={{ height: '45px', width: '45px' }}
                    title={file.name}
                  >
                    <i className='fas fa-file-word text-white'></i>
                  </div>
                ) : (
                  <div
                    className='bg-secondary rounded d-flex align-items-center justify-content-center'
                    style={{ height: '45px', width: '45px' }}
                    title={file.name}
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

  // Gửi sticker
  const sendStickerMessage = (stickerUrl: string) => {
    if (!selectedConversation) return

    const messageDTO = {
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content: '',
      type: 'STICKER',
      mediaUrls: [stickerUrl]
    }

    publishMessage('/app/private-message', messageDTO)

    // Đóng sticker picker sau khi gửi
    setShowStickerPicker(false)
  }

  // Cập nhật phương thức handleMembersAdded để tải lại danh sách thành viên và tin nhắn
  const handleMembersAdded = async () => {
    if (!selectedConversation) return

    try {
      // Tải lại danh sách thành viên
      const fetchParticipantsAgain = async () => {
        try {
          if (!selectedConversation) return
          const res = await messageAPI.getParticipants(selectedConversation.id)
          const data = res.data
          setParticipants(data)
        } catch (err) {
          console.error('Fetch participants error:', err)
        }
      }

      // Tải lại tin nhắn (để hiển thị thông báo system về việc thêm thành viên)
      const fetchMessagesAgain = async () => {
        try {
          if (!selectedConversation) return
          const res = await messageAPI.getMessages(selectedConversation.id)
          const data = res.data
          setMessages(data)

          // Scroll xuống cuối sau khi tin nhắn được tải
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'auto' })
          })
        } catch (err) {
          console.error('Fetch messages error:', err)
        }
      }

      // Thực hiện cả 2 API call
      await Promise.all([fetchParticipantsAgain(), fetchMessagesAgain()])
    } catch (error) {
      console.error('Failed to update group data:', error)
      toast.error('Đã có lỗi xảy ra khi cập nhật dữ liệu nhóm')
    }
  }

  // Xử lý khi thành viên bị xóa khỏi nhóm
  const handleMemberRemoved = async (memberId: string) => {
    if (!selectedConversation) return

    try {
      // Cập nhật danh sách thành viên cục bộ ngay lập tức để UI phản hồi nhanh
      setParticipants((prevParticipants) => prevParticipants.filter((p) => p.userId !== memberId))

      // Tải lại tin nhắn để hiển thị thông báo hệ thống về việc xóa thành viên
      const fetchMessagesAgain = async () => {
        try {
          if (!selectedConversation) return
          const res = await messageAPI.getMessages(selectedConversation.id)
          const data = res.data
          setMessages(data)

          // Scroll xuống cuối sau khi tin nhắn được tải
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'auto' })
          })
        } catch (err) {
          console.error('Fetch messages error:', err)
        }
      }

      await fetchMessagesAgain()
    } catch (error) {
      console.error('Failed to update group data after member removal:', error)
      toast.error('Đã có lỗi xảy ra khi cập nhật dữ liệu nhóm')
    }
  }

  // Xử lý khi thành viên được thăng chức
  const handleMemberPromoted = async (memberId: string) => {
    if (!selectedConversation) return

    try {
      // Cập nhật vai trò của thành viên cục bộ
      setParticipants((prevParticipants) =>
        prevParticipants.map((p) => (p.userId === memberId ? { ...p, role: 'MODERATOR' } : p))
      )

      // Tải lại tin nhắn để hiển thị thông báo hệ thống về việc thăng cấp thành viên
      const fetchMessagesAgain = async () => {
        try {
          if (!selectedConversation) return
          const res = await messageAPI.getMessages(selectedConversation.id)
          const data = res.data
          setMessages(data)

          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'auto' })
          })
        } catch (err) {
          console.error('Fetch messages error:', err)
        }
      }

      await fetchMessagesAgain()
    } catch (error) {
      console.error('Failed to update group data after promotion:', error)
      toast.error('Đã có lỗi xảy ra khi cập nhật dữ liệu nhóm')
    }
  }

  // Xử lý khi nhóm bị giải tán
  const handleGroupDissolved = (groupId: string) => {
    try {
      refreshConversations()
      setSelectedConversation(null)
    } catch (error) {
      console.error('Error handling group dissolution:', error)
    }
  }

  // Thêm hàm xử lý khi rời nhóm
  const handleLeaveGroup = (groupId: string) => {
    try {
      // Cập nhật UI - tải lại danh sách cuộc trò chuyện
      refreshConversations()

      // Xóa cuộc trò chuyện hiện tại khỏi view
      setSelectedConversation(null)

      toast.success('Đã rời khỏi nhóm')
    } catch (error) {
      console.error('Error handling leave group:', error)
    }
  }

    const handleDemoteModerator = async (memberId: string) => {
      if (!selectedConversation) return
      try {
        // Cập nhật vai trò của thành viên cục bộ
        setParticipants((prevParticipants) =>
          prevParticipants.map((p) => (p.userId === memberId ? { ...p, role: 'MEMBER' } : p))
        )

        // Tải lại tin nhắn để hiển thị thông báo hệ thống về việc hạ cấp thành viên
        const fetchMessagesAgain = async () => {
          try {
            if (!selectedConversation) return
            const res = await messageAPI.getMessages(selectedConversation.id)
            const data = res.data
            setMessages(data)

            requestAnimationFrame(() => {
              bottomRef.current?.scrollIntoView({ behavior: 'auto' })
            })
          } catch (err) {
            console.error('Fetch messages error:', err)
          }
        }

        await fetchMessagesAgain()
      } catch (error) {
        console.error('Failed to update group data after demotion:', error)
        toast.error('Đã có lỗi xảy ra khi cập nhật dữ liệu nhóm')
      }
    }

    // Cập nhật UI
      // setParticipants((prevParticipants) =>
      //   prevParticipants.map((p) => ({
      //     ...p,
      //     role: p.userId === selectedNewOwner ? 'ADMIN' : 
      //           p.userId === currentUserId ? 'MEMBER' : p.role
      //   }))
      // );
      const handleTransferOwner = async (newOwnerId: string) => {
        if (!selectedConversation) return
        try {
          // Cập nhật vai trò của thành viên cục bộ
          setParticipants((prevParticipants) =>
            prevParticipants.map((p) => (p.userId === newOwnerId ? { ...p, role: 'ADMIN' } : p))
          )

          // Tải lại tin nhắn để hiển thị thông báo hệ thống về việc chuyển quyền sở hữu
          const fetchMessagesAgain = async () => {
            try {
              if (!selectedConversation) return
              const res = await messageAPI.getMessages(selectedConversation.id)
              const data = res.data
              setMessages(data)

              requestAnimationFrame(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'auto' })
              })
            } catch (err) {
              console.error('Fetch messages error:', err)
            }
          }

          await fetchMessagesAgain()
        } catch (error) {
          console.error('Failed to update group data after transfer:', error)
          toast.error('Đã có lỗi xảy ra khi cập nhật dữ liệu nhóm')
        }
      }

  // Insert emoji at current cursor position or at the end
  const onEmojiClick = (emojiData: EmojiClickData) => {
    const input = inputRef.current
    if (input) {
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const updatedMessage = newMessage.substring(0, start) + emojiData.emoji + newMessage.substring(end)

      setNewMessage(updatedMessage)

      // Di chuyển con trỏ đến sau emoji
      setTimeout(() => {
        input.selectionStart = start + emojiData.emoji.length
        input.selectionEnd = start + emojiData.emoji.length
        input.focus()
      }, 0)
    } else {
      setNewMessage((prev) => prev + emojiData.emoji)
    }
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).classList.contains('emoji-btn')
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEmojiButtonClick = () => {
    setShowStickerPicker(false)
    setShowEmojiPicker(!showEmojiPicker)
  }

  // Xử lý khi click vào nút forward
  const handleForwardMessage = (message: Message) => {
    setMessageToForward(message)
    setShowForwardModal(true)
  }

  return (
    <>
      {selectedConversation ? (
        <div
          className='chat-area flex-grow-1 d-flex flex-column bg-light'
          style={{ width: '100%', position: 'relative' }}
        >
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
              <button className='btn btn-light btn-sm' onClick={() => setShowGroupInfo((prev) => !prev)}>
                <FaBars />
              </button>
            )}
          </div>

          {/* Sử dụng component GroupInfoSidebar */}
          {/* Sử dụng component GroupInfoSidebar */}
          {selectedConversation.type === 'GROUP' && (
            <GroupInfoSidebar
              show={showGroupInfo}
              onHide={() => setShowGroupInfo(false)}
              conversation={selectedConversation}
              participants={participants}
              onAddMember={() => setShowAddMemberModal(true)}
              currentUserId={currentUserId}
              isAdmin={participants.some(
                (participant) => participant.userId === currentUserId && participant.role === 'ADMIN'
              )}
              onMemberRemoved={handleMemberRemoved}
              onMemberPromoted={handleMemberPromoted}
              onGroupDissolved={handleGroupDissolved}
              onLeaveGroup={handleLeaveGroup} 
              onDemoteModerator={handleDemoteModerator}
              onTransferOwnership={handleTransferOwner}
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
                participants={participants || []}
                conversationType={(selectedConversation?.type as 'PRIVATE' | 'GROUP') || 'PRIVATE'}
                onRecall={handleRecallMessage}
                onForward={handleForwardMessage} // Add this prop
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className='chat-input px-4 py-3 bg-white border-top position-relative'>
            {selectedFiles.length > 0 && renderFilePreview()}

            {/* Add Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className='position-absolute bottom-100 start-0 mb-2' style={{ zIndex: 10 }}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}

            <form onSubmit={handleSendMessage}>
              <div className='d-flex align-items-center gap-2'>
                <button
                  type='button'
                  className='btn btn-light m-0 px-2 py-1'
                  title='Chọn sticker'
                  onClick={() => setShowStickerPicker(true)}
                  disabled={isUploading}
                >
                  <i className='far fa-sticky-note'></i>
                </button>

                {/* Add Emoji Button */}
                <button
                  type='button'
                  className='btn btn-light m-0 px-2 py-1 emoji-btn'
                  title='Chọn emoji'
                  onClick={handleEmojiButtonClick}
                  disabled={isUploading}
                >
                  <i className='fas fa-smile'></i>
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
                  ref={inputRef}
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
              currentMembers={participants.map((participant) => participant.userId)}
              onMembersAdded={handleMembersAdded}
            />
          )}

          {/* Forward Message Modal */}
          {showForwardModal && messageToForward && (
            <ForwardMessageModal
              show={showForwardModal}
              onHide={() => setShowForwardModal(false)}
              message={messageToForward}
              userId={currentUserId}
              publishMessage={publishMessage}
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
