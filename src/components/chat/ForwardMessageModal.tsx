// src/components/chat/ForwardMessageModal.tsx
import { useEffect, useState } from 'react'
import { Modal, Form } from 'react-bootstrap'
import messageAPI from 'src/apis/message.api'
import { Conversation } from 'src/types/message.type'
import { toast } from 'react-toastify'

interface ForwardMessageModalProps {
  show: boolean
  onHide: () => void
  message: any // Tin nhắn cần chuyển tiếp
  userId: string
  publishMessage: (destination: string, body: any) => void
}

const ForwardMessageModal = ({ show, onHide, message, userId, publishMessage }: ForwardMessageModalProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Fetch danh sách cuộc trò chuyện
  useEffect(() => {
    if (show) {
      const fetchConversations = async () => {
        try {
          setIsLoading(true)
          const response = await messageAPI.getConversations(userId)
          setConversations(response.data.data || [])
        } catch (error) {
          console.error('Failed to fetch conversations:', error)
          toast.error('Không thể tải danh sách hội thoại')
        } finally {
          setIsLoading(false)
        }
      }

      fetchConversations()
    }
  }, [show, userId])

  // Lọc cuộc trò chuyện theo tên
  const filteredConversations = conversations.filter(conversation => {
    if (conversation.name) {
      return conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  // Xử lý chuyển tiếp tin nhắn
  const handleForward = async () => {
    if (!selectedConversationId) {
      toast.error('Vui lòng chọn hội thoại để chuyển tiếp')
      return
    }

    try {
      // Tạo tin nhắn mới với nội dung từ tin nhắn gốc
      const forwardedMessage = {
        conversationId: selectedConversationId,
        senderId: userId,
        content: message.content || '',
        type: message.type,
        mediaUrls: message.mediaUrls || null,
        isForwarded: true, // Đánh dấu là tin nhắn chuyển tiếp
        originalSenderId: message.senderId // ID người gửi gốc
      }

      // Gửi tin nhắn qua WebSocket
      publishMessage('/app/private-message', forwardedMessage)

      toast.success('Đã chuyển tiếp tin nhắn')
      onHide()
    } catch (error) {
      console.error('Error forwarding message:', error)
      toast.error('Không thể chuyển tiếp tin nhắn')
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chuyển tiếp tin nhắn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <div className="conversation-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status" />
              <p className="mt-2 text-muted">Đang tải danh sách hội thoại...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item d-flex align-items-center p-2 rounded mb-2 ${
                  selectedConversationId === conversation.id ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedConversationId(conversation.id)}
              >
                <div className="me-2">
                  <img
                    src={conversation.avatar || 'https://via.placeholder.com/40'}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <p className="mb-0 fw-medium">{conversation.name || 'Hội thoại không tên'}</p>
                  <small className="text-muted">
                    {conversation.type === 'GROUP' ? 'Nhóm' : 'Cá nhân'}
                  </small>
                </div>
                {selectedConversationId === conversation.id && (
                  <div className="ms-auto">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-muted py-3">Không tìm thấy hội thoại nào</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Hủy
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleForward}
          disabled={!selectedConversationId || isLoading}
        >
          Chuyển tiếp
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ForwardMessageModal