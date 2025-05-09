import { useContext, useEffect, useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { BsCamera, BsSearch } from 'react-icons/bs'
import fileAPI from 'src/apis/file.api'
import groupAPI from 'src/apis/group.api'
import friendAPI from 'src/apis/friend.api' // Import friendAPI
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { Friend } from 'src/types/friend.type'

interface CreateGroupModalProps {
  show: boolean
  onHide: () => void
  onGroupCreated?: () => void // Callback khi tạo nhóm thành công
}

export default function CreateGroupModal({ show, onHide, onGroupCreated }: CreateGroupModalProps) {
  const { profile } = useContext(AppContext)
  const [groupName, setGroupName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [groupImagePreview, setGroupImagePreview] = useState<string | null>(null)
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(false)

  // Load danh sách bạn bè từ API khi modal được mở
  useEffect(() => {
    if (show) {
      fetchFriends()
    }
  }, [show])

  // Hàm lấy danh sách bạn bè
  const fetchFriends = async () => {
    try {
      setIsLoadingFriends(true)
      const response = await friendAPI.getFriends()
      setFriends(response.data.data || [])
    } catch (error) {
      console.error('Error fetching friends:', error)
      toast.error('Không thể tải danh sách bạn bè')
    } finally {
      setIsLoadingFriends(false)
    }
  }

  // Reset form khi đóng modal
  useEffect(() => {
    if (!show) {
      resetForm()
    }
  }, [show])

  const resetForm = () => {
    setGroupName('')
    setSearchQuery('')
    setSelectedFriends([])
    setGroupImagePreview(null)
    setGroupImageFile(null)
    setIsCreating(false)
  }

  const handleCheckboxChange = (userId: string) => {
    if (selectedFriends.includes(userId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== userId))
    } else {
      setSelectedFriends([...selectedFriends, userId])
    }
  }

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Kiểm tra xem file có phải là hình ảnh không
      if (file.type.startsWith('image/')) {
        // Lưu file để upload sau
        setGroupImageFile(file)

        // Hiển thị preview
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setGroupImagePreview(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Vui lòng chọn file hình ảnh')
      }
    }
  }

  const handleCreateGroup = async () => {
    if (!profile?.userId) {
      toast.error('Bạn cần đăng nhập để tạo nhóm')
      return
    }

    if (!groupName.trim()) {
      toast.error('Vui lòng nhập tên nhóm')
      return
    }

    if (selectedFriends.length < 1) {
      toast.error('Vui lòng chọn ít nhất 1 người bạn để thêm vào nhóm')
      return
    }

    try {
      setIsCreating(true)

      // Chuẩn bị userIds (thêm cả userId của người tạo nhóm)
      const userIds = [...selectedFriends]
      if (!userIds.includes(profile.userId)) {
        userIds.push(profile.userId)
      }

      let avatarUrl = ''

      // Upload ảnh nếu có
      if (groupImageFile) {
        const response = await fileAPI.upload(groupImageFile)
        avatarUrl = response.data.fileUrl
      }

      // Gọi API tạo nhóm
      await groupAPI.createGroup(groupName, avatarUrl, userIds)

      toast.success('Tạo nhóm thành công!')

      // Reset form và đóng modal
      resetForm()
      onHide()

      // Gọi callback sau khi tạo nhóm thành công (nếu có)
      if (onGroupCreated) {
        onGroupCreated()
      }
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Không thể tạo nhóm. Vui lòng thử lại sau!')
    } finally {
      setIsCreating(false)
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
        <Modal.Title>Tạo nhóm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='mb-4'>
          <div className='d-flex align-items-center'>
            <div
              className='bg-light rounded-circle d-flex align-items-center justify-content-center me-3 position-relative'
              style={{ width: '48px', height: '48px', cursor: 'pointer' }}
              onClick={() => document.getElementById('group-image-upload')?.click()}
            >
              {groupImagePreview ? (
                <img
                  src={groupImagePreview}
                  className='rounded-circle'
                  alt='Group'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
              ) : (
                <div className='d-flex align-items-center justify-content-center'>
                  <BsCamera className='text-secondary fs-4' />
                </div>
              )}
              <input
                type='file'
                id='group-image-upload'
                className='d-none'
                accept='image/*'
                onChange={handleImageUpload}
              />
            </div>
            <Form.Control
              type='text'
              placeholder='Nhập tên nhóm...'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </Form.Group>

        <InputGroup className='mb-3'>
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder='Tìm kiếm bạn bè'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <div className='friend-selection-container' style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <h6>Chọn bạn bè để thêm vào nhóm</h6>
          <div className='friend-list'>
            {isLoadingFriends ? (
              <div className='text-center py-3'>
                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                Đang tải danh sách bạn bè...
              </div>
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend.userId} className='d-flex align-items-center p-2 border-bottom'>
                  <Form.Check
                    type='checkbox'
                    className='me-3'
                    checked={selectedFriends.includes(friend.userId)}
                    onChange={() => handleCheckboxChange(friend.userId)}
                  />
                  <img
                    src={
                      friend.avatar ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                    }
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt={friend.displayName || ''}
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <div>{friend.displayName}</div>
                    {/* {(friend.username || friend.phone) && (
                      <small className='text-muted'>{friend.username || friend.phone}</small>
                    )} */}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-3 text-muted'>
                {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Bạn chưa có bạn bè'}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant='primary'
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || selectedFriends.length < 1 || isCreating}
        >
          {isCreating ? (
            <>
              <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
              Đang tạo...
            </>
          ) : (
            'Tạo nhóm'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
