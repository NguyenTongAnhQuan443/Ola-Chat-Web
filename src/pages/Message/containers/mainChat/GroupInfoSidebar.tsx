import { useState, useRef, useEffect } from 'react'
import { FaUserPlus, FaUserMinus, FaTrash, FaUserShield, FaChevronLeft } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { Conversation, Participant } from 'src/types/message.type'
import { User } from 'src/types/user.type'
import { toast } from 'react-toastify'
import groupAPI from 'src/apis/group.api'
import { Modal } from 'react-bootstrap'

interface GroupInfoSidebarProps {
  show: boolean
  onHide: () => void
  conversation: Conversation
  participants: Participant[]
  onAddMember: () => void
  currentUserId: string
  isAdmin?: boolean

  onMemberRemoved?: (memberId: string) => void
  onMemberPromoted?: (memberId: string) => void
  onGroupDissolved?: (groupId: string) => void
}

const GroupInfoSidebar = ({
  show,
  onHide,
  conversation,
  participants,
  onAddMember,
  currentUserId,
  isAdmin = true,
  onMemberRemoved,
  onMemberPromoted,
  onGroupDissolved
}: GroupInfoSidebarProps) => {
  const [showMemberList, setShowMemberList] = useState(false)
  const [showMemberOptions, setShowMemberOptions] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'promote' | 'demote' | 'dissolve'
    memberId?: string
    memberName?: string
  } | null>(null)
  const [blockRejoin, setBlockRejoin] = useState(false)
  
  const optionsRef = useRef<HTMLDivElement>(null)
  
  // Đóng dropdown options khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowMemberOptions(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Tìm vai trò của user
  const getUserRole = (user: Participant) => {
    if (user.role === 'ADMIN') return 'Trưởng nhóm'
    if (user.role === 'MODERATOR') return 'Phó nhóm'
    return 'Thành viên'
  }
  
  // Cập nhật các hàm xử lý khi thực hiện các hành động quản lý nhóm

// Xử lý khi xóa thành viên
const handleRemoveMember = async (memberId: string) => {
  try {
    await groupAPI.removeMember(conversation.id, memberId)
    toast.success('Đã xóa thành viên khỏi nhóm')
    
    // Cập nhật UI sau khi xóa thành công
    // Giả sử bạn có một callback để reload thông tin nhóm
    if (onMemberRemoved) {
      onMemberRemoved(memberId)
    }
    
    setShowMemberOptions(null)
    setConfirmAction(null)
    setBlockRejoin(false) // Reset checkbox chặn tham gia lại
  } catch (error) {
    toast.error('Không thể xóa thành viên')
    console.error(error)
  }
}

// Xử lý khi thăng chức thành viên thành phó nhóm
const handlePromoteMember = async (memberId: string) => {
  try {
    await groupAPI.addModerator(conversation.id, memberId)
    toast.success('Đã thêm thành viên làm phó nhóm')
    
    // Cập nhật UI sau khi thêm phó nhóm thành công
    // Giả sử bạn có một callback để reload thông tin nhóm
    if (onMemberPromoted) {
      onMemberPromoted(memberId)
    }
    
    setShowMemberOptions(null)
    setConfirmAction(null)
  } catch (error) {
    toast.error('Không thể thăng chức thành viên')
    console.error(error)
  }
}

// Xử lý khi giải tán nhóm
const handleDissolveGroup = async () => {
  try {
    await groupAPI.dissolution(conversation.id)
    toast.success('Đã giải tán nhóm')
    
    // Cập nhật UI sau khi giải tán nhóm thành công
    // Thông báo cho component cha để cập nhật danh sách hội thoại
    if (onGroupDissolved) {
      onGroupDissolved(conversation.id)
    }
    
    onHide() // Đóng sidebar
  } catch (error) {
    toast.error('Không thể giải tán nhóm')
    console.error(error)
  }
}

  return (
    <>
      <div
        className='group-info-sidebar position-absolute'
        style={{
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          zIndex: 1000,
          transition: 'transform 0.3s ease',
          display: show ? 'block' : 'none',
          transform: show ? 'translateX(0)' : 'translateX(100%)',
          overflowY: 'auto',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          backgroundColor: '#F1F4F9',
          color: '#0C1024'
        }}
      >
        {!showMemberList ? (
          // Màn hình chính của sidebar
          <>
            <div className='p-3 border-bottom border-secondary'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>Thông tin nhóm</h5>
                <button className='btn-close btn-close-black' onClick={onHide}></button>
              </div>

              <div className='text-center mb-3'>
                <img
                  src={conversation.avatar || 'https://via.placeholder.com/80'}
                  alt='Group avatar'
                  className='rounded-circle'
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <h6 className='mt-2'>{conversation.name}</h6>
              </div>
            </div>

            <div className='p-3 border-bottom border-secondary'>
              <div 
                className='d-flex justify-content-between align-items-center cursor-pointer' 
                onClick={() => setShowMemberList(true)}
                style={{ cursor: 'pointer' }}
              >
                <h6>Thành viên nhóm</h6>
                <span className='badge bg-secondary'>{participants.length}</span>
              </div>

              <div className='mt-2 overflow-auto' style={{ maxHeight: '200px' }}>
                {/* Hiển thị 5 thành viên đầu tiên */}
                {participants.slice(0, 5).map(participant => (
                  <div key={participant.userId} className='d-flex align-items-center p-2'>
                    <img
                      src={participant.avatar || 'https://via.placeholder.com/40'}
                      alt={participant.displayName}
                      className='rounded-circle me-2'
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <div>{participant.displayName}</div>
                      <small className='text-muted'>{getUserRole(participant)}</small>
                    </div>
                  </div>
                ))}
                
                {participants.length > 5 && (
                  <div className='text-center mt-2'>
                    <button 
                      className='btn btn-sm btn-outline-secondary'
                      onClick={() => setShowMemberList(true)}
                    >
                      Xem tất cả
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className='p-3'>
                <h6 className='mb-3'>Quản lý nhóm</h6>
                <div className='list-group border-0'>
                  <button
                    className='list-group-item list-group-item-action d-flex align-items-center border-0'
                    style={{ backgroundColor: '#F1F4F9', color: '#0C1024' }}
                    onClick={onAddMember}
                  >
                    <FaUserPlus className='me-3' />
                    Thêm thành viên
                  </button>
                  <button
                    className='list-group-item list-group-item-action d-flex align-items-center border-0 text-danger'
                    style={{ backgroundColor: '#F1F4F9' }}
                    onClick={() => setConfirmAction({ type: 'dissolve' })}
                  >
                    <FaTrash className='me-3' />
                    Giải tán nhóm
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Màn hình danh sách thành viên
          <div className='h-100 d-flex flex-column'>
            <div className='p-3 border-bottom border-secondary'>
              <div className='d-flex align-items-center'>
                <button 
                  className='btn btn-sm btn-light me-2'
                  onClick={() => setShowMemberList(false)}
                >
                  <FaChevronLeft />
                </button>
                <h5 className='mb-0'>Thành viên</h5>
              </div>
            </div>
            
            <div className='p-3'>
              <button 
                className='btn btn-outline-primary w-100 mb-3'
                onClick={onAddMember}
              >
                <FaUserPlus className='me-2' /> Thêm thành viên
              </button>
              
              <h6 className='d-flex align-items-center justify-content-between'>
                Danh sách thành viên ({participants.length})
              </h6>
              
              <div className='overflow-auto' style={{ flex: 1 }}>
                {/* Trưởng nhóm */}
                {participants
                  .filter(participant => participant.role === 'ADMIN')
                  .map(admin => (
                    <div key={admin.userId} className='d-flex align-items-center p-2 border-bottom'>
                      <img
                        src={admin.avatar || 'https://via.placeholder.com/40'}
                        alt={admin.displayName}
                        className='rounded-circle me-2'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div className='flex-grow-1'>
                        <div>{admin.displayName}</div>
                        <small className='text-primary'>Trưởng nhóm</small>
                      </div>
                    </div>
                  ))}
                  
                {/* Phó nhóm */}
                {participants
                  .filter(participant => participant.role === 'MODERATOR')
                  .map(mod => (
                    <div key={mod.userId} className='d-flex align-items-center p-2 border-bottom position-relative'>
                      <img
                        src={mod.avatar || 'https://via.placeholder.com/40'}
                        alt={mod.displayName}
                        className='rounded-circle me-2'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div className='flex-grow-1'>
                        <div>{mod.displayName}</div>
                        <small className='text-info'>Phó nhóm</small>
                      </div>
                      
                      {isAdmin && mod.userId !== currentUserId && (
                        <div className='position-relative'>
                          <button 
                            className='btn btn-sm btn-light'
                            onClick={() => setShowMemberOptions(mod.userId)}
                          >
                            <BsThreeDots />
                          </button>
                          
                          {showMemberOptions === mod.userId && (
                            <div 
                              ref={optionsRef}
                              className='position-absolute end-0 bg-white shadow rounded py-1' 
                              style={{ zIndex: 10, width: '200px' }}
                            >
                              <button
                                className='dropdown-item text-danger'
                                onClick={() => {
                                  setConfirmAction({
                                    type: 'delete',
                                    memberId: mod.userId,
                                    memberName: mod.displayName
                                  })
                                  setShowMemberOptions(null)
                                }}
                              >
                                Xóa khỏi nhóm
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                {/* Thành viên thường */}
                {participants
                  .filter(participant => participant.role !== 'ADMIN' && participant.role !== 'MODERATOR') 
                  .map(member => (
                    <div key={member.userId} className='d-flex align-items-center p-2 border-bottom'>
                      <img
                        src={member.avatar || 'https://via.placeholder.com/40'}
                        alt={member.displayName}
                        className='rounded-circle me-2'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div className='flex-grow-1'>
                        <div>{member.displayName}</div>
                        <small className='text-muted'>Thành viên</small>
                      </div>
                      
                      {isAdmin && member.userId !== currentUserId && (
                        <div className='position-relative'>
                          <button 
                            className='btn btn-sm btn-light'
                            onClick={() => setShowMemberOptions(member.userId)}
                          >
                            <BsThreeDots />
                          </button>
                          
                          {showMemberOptions === member.userId && (
                            <div 
                              ref={optionsRef}
                              className='position-absolute end-0 bg-white shadow rounded py-1' 
                              style={{ zIndex: 10, width: '200px' }}
                            >
                              <button
                                className='dropdown-item'
                                onClick={() => {
                                  setConfirmAction({
                                    type: 'promote',
                                    memberId: member.userId,
                                    memberName: member.displayName
                                  })
                                  setShowMemberOptions(null)
                                }}
                              >
                                Thêm phó nhóm
                              </button>
                              <button
                                className='dropdown-item text-danger'
                                onClick={() => {
                                  setConfirmAction({
                                    type: 'delete',
                                    memberId: member.userId,
                                    memberName: member.displayName
                                  })
                                  setShowMemberOptions(null)
                                }}
                              >
                                Xóa khỏi nhóm
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa thành viên */}
      <Modal 
        show={confirmAction?.type === 'delete'} 
        onHide={() => setConfirmAction(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Xóa thành viên  này khỏi nhóm?</p>
          <div className="form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="blockRejoin"
              checked={blockRejoin}
              onChange={(e) => setBlockRejoin(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="blockRejoin">
              Chặn người này tham gia lại
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setConfirmAction(null)}
          >
            Đóng
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (confirmAction?.memberId) {
                handleRemoveMember(confirmAction.memberId)
              }
            }}
          >
            Đồng ý
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận thăng chức thành viên */}
      <Modal 
        show={confirmAction?.type === 'promote'} 
        onHide={() => setConfirmAction(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Thêm {confirmAction?.memberName} làm phó nhóm?</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setConfirmAction(null)}
          >
            Đóng
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (confirmAction?.memberId) {
                handlePromoteMember(confirmAction.memberId)
              }
            }}
          >
            Đồng ý
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận giải tán nhóm */}
      <Modal 
        show={confirmAction?.type === 'dissolve'} 
        onHide={() => setConfirmAction(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Giải tán nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Mời tất cả mọi người rời nhóm và xóa tin nhắn? Nhóm đã giải tán sẽ KHÔNG THỂ khôi phục.</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setConfirmAction(null)}
          >
            Không
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleDissolveGroup}
          >
            Giải tán nhóm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GroupInfoSidebar