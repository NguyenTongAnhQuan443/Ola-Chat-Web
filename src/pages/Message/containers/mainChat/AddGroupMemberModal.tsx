import { useContext, useEffect, useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import friendAPI from 'src/apis/friend.api'
import groupAPI from 'src/apis/group.api' // Giả sử có API này
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { Friend } from 'src/types/friend.type'

interface AddGroupMemberModalProps {
  show: boolean
  onHide: () => void
  conversationId: string
  currentMembers: string[] // Danh sách userId của các thành viên hiện tại
  onMembersAdded?: () => void // Callback khi thêm thành viên thành công
}

export default function AddGroupMemberModal({ 
  show, 
  onHide, 
  conversationId,
  currentMembers,
  onMembersAdded 
}: AddGroupMemberModalProps) {
  const { profile } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(false)
  const [isAddingMembers, setIsAddingMembers] = useState(false)

  // Load danh sách bạn bè khi modal được mở
  useEffect(() => {
    if (show) {
      fetchFriends()
    }
  }, [show])

  // Reset form khi đóng modal
  useEffect(() => {
    if (!show) {
      setSearchQuery('')
      setSelectedUsers([])
    }
  }, [show])

  // Fetch danh sách bạn bè
  const fetchFriends = async () => {
    try {
      setIsLoadingFriends(true)
      const response = await friendAPI.getFriends()
      setFriends(response.data.data || [])
      // Tự động chọn bạn bè đã trong nhóm
      const friendsInGroup = response.data.data
        .filter((friend) => currentMembers.includes(friend.userId))
        .map((friend) => friend.userId)
      setSelectedUsers(friendsInGroup)
    } catch (error) {
      console.error('Error fetching friends:', error)
      toast.error('Không thể tải danh sách bạn bè')
    } finally {
      setIsLoadingFriends(false)
    }
  }

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (userId: string) => {
    // Nếu user đã là thành viên của nhóm, không cho phép thay đổi
    if (currentMembers.includes(userId)) {
      return
    }
    
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Xử lý thêm thành viên
  const handleAddMembers = async () => {
    const newMembers = selectedUsers.filter(id => !currentMembers.includes(id))
    
    if (newMembers.length === 0) {
      toast.info('Vui lòng chọn ít nhất một người bạn để thêm vào nhóm')
      return
    }

    try {
      setIsAddingMembers(true)
      console.log(newMembers)
      console.log(conversationId)
      // Gọi API thêm thành viên vào nhóm
      await groupAPI.addMembers(conversationId, newMembers)
      toast.success('Thêm thành viên thành công!')
      
      // Đóng modal và gọi callback
      onHide()
      if (onMembersAdded) {
        onMembersAdded()
      }
    } catch (error) {
      console.error('Error adding members:', error)
      toast.error('Không thể thêm thành viên. Vui lòng thử lại sau!')
    } finally {
      setIsAddingMembers(false)
    }
  }

  // Lọc danh sách bạn bè theo từ khóa tìm kiếm
  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
)
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thành viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex mb-3 flex-wrap">
          <Button variant="primary" size="sm" className="me-2 mb-2">
            Tất cả
          </Button>
          <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
            gr chat
          </Button>
          <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
            Gia đình
          </Button>
          <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
            Công việc
          </Button>
          <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
            Bạn bè
          </Button>
          <Button variant="outline-secondary" size="sm" className="mb-2">
            Trả lời sau
          </Button>
        </div>

        <div className="friend-selection-container" style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <h6 className="mb-3">Trò chuyện gần đây</h6>
          <div className="friend-list mb-4">
            {isLoadingFriends ? (
              <div className="text-center py-3">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang tải danh sách bạn bè...
              </div>
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => {
                const isInGroup = currentMembers.includes(friend.userId)
                return (
                  <div key={friend.userId} className="d-flex align-items-center p-2 border-bottom">
                    <Form.Check
                      type="checkbox"
                      className="me-3"
                      checked={selectedUsers.includes(friend.userId)}
                      onChange={() => handleCheckboxChange(friend.userId)}
                      disabled={isInGroup}
                    />
                    <img
                      src={friend.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                      alt={friend.displayName || ''}
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <div>{friend.displayName}</div>
                      {isInGroup && <small className="text-primary">Đã tham gia</small>}
                      {/* {!isInGroup && (friend.username || friend.phone) && (
                        <small className="text-muted">{friend.username || friend.phone}</small>
                      )} */}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-3 text-muted">
                {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Bạn chưa có bạn bè'}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleAddMembers}
          disabled={isAddingMembers || selectedUsers.filter(id => !currentMembers.includes(id)).length === 0}
        >
          {isAddingMembers ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang thêm...
            </>
          ) : (
            'Xác nhận'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}