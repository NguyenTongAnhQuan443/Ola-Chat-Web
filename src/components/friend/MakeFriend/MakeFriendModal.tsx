import { useState, useContext, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import { User } from 'src/types/user.type'
import userApi from 'src/apis/user.api'
import friendAPI from 'src/apis/friend.api'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'

interface MakeFriendModalProps {
  show: boolean
  onHide: () => void
}

// Định nghĩa các trạng thái friendAction
enum FriendActionCode {
  NONE = 0, // Không làm gì (chính mình)
  SEND_REQUEST = 1, // Gửi lời mời kết bạn
  CANCEL_REQUEST = 2, // Hủy lời mời đã gửi
  ACCEPT_REQUEST = 3, // Chấp nhận lời mời
  UNFRIEND = 4, // Hủy kết bạn
  MESSAGE = 5 // Đã là bạn, có thể nhắn tin
}

// Mở rộng interface User để bao gồm trạng thái friendAction
interface UserWithFriendAction extends User {
  friendAction?: FriendActionCode
}

export default function MakeFriendModal({ show, onHide }: MakeFriendModalProps) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<UserWithFriendAction | null>(null)
  const [error, setError] = useState<string>('')
  const { profile } = useContext(AppContext)

  const handleSubmitSearchFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    try {
      if (!query) {
        toast.error('Vui lòng nhập số điện thoại hoặc email')
        return
      }
      const res = await userApi.getInfoFriend(query)
      // Giả sử API trả về thêm trường friendAction
      setResult(res.data.data)
    } catch (err) {
      setError('Không tìm thấy người dùng phù hợp')
    }
  }

  // Xử lý hành động tương ứng với mỗi trạng thái friendAction
  const handleFriendAction = async (receiverId: string, action: FriendActionCode) => {
    if (!profile?.userId) return

    try {
      switch (action) {
        case FriendActionCode.SEND_REQUEST:
          await friendAPI.sendRequestAddFriend({ senderId: profile.userId, receiverId })
          toast.success('Đã gửi lời mời kết bạn!')
          // Cập nhật UI sau khi gửi lời mời
          setResult((prev) => (prev ? { ...prev, friendAction: FriendActionCode.CANCEL_REQUEST } : null))
          break

        case FriendActionCode.CANCEL_REQUEST:
          await friendAPI.cancelRequestAddFriend(receiverId)
          toast.success('Đã hủy lời mời kết bạn!')
          // Cập nhật UI sau khi hủy lời mời
          setResult((prev) => (prev ? { ...prev, friendAction: FriendActionCode.SEND_REQUEST } : null))
          break

        case FriendActionCode.ACCEPT_REQUEST:
          await friendAPI.acceptRequest(receiverId)
          toast.success('Đã chấp nhận lời mời kết bạn!')
          // Cập nhật UI sau khi chấp nhận lời mời
          setResult((prev) => (prev ? { ...prev, friendAction: FriendActionCode.MESSAGE } : null))
          break

        case FriendActionCode.UNFRIEND:
          await friendAPI.acceptRequest(receiverId)
          toast.success('Đã hủy kết bạn!')
          // Cập nhật UI sau khi hủy kết bạn
          setResult((prev) => (prev ? { ...prev, friendAction: FriendActionCode.SEND_REQUEST } : null))
          break

        case FriendActionCode.MESSAGE:
          // Chuyển hướng đến trang tin nhắn hoặc mở hộp thoại nhắn tin
          // Có thể thêm logic chuyển hướng ở đây
          onHide() // Đóng modal trước khi chuyển hướng
          break

        default:
          break
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  // Render Button dựa vào friendAction
  const renderActionButton = (user: UserWithFriendAction) => {
    // Nếu là chính mình
    if (user.userId === profile?.userId) {
      return null // Không hiển thị button
    }

    // Dựa vào friendAction để hiển thị button phù hợp
    switch (user.friendAction) {
      case FriendActionCode.NONE:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.SEND_REQUEST)}
            style={{ backgroundColor: '#4C68D5' }}
          >
            Kết bạn
          </Button>
        )

      case FriendActionCode.SEND_REQUEST:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.SEND_REQUEST)}
            style={{ backgroundColor: '#4C68D5' }}
          >
            Kết bạn
          </Button>
        )

      case FriendActionCode.CANCEL_REQUEST:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.CANCEL_REQUEST)}
            variant='outline-secondary'
          >
            Hủy lời mời
          </Button>
        )

      case FriendActionCode.ACCEPT_REQUEST:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.ACCEPT_REQUEST)}
            style={{ backgroundColor: '#4C68D5' }}
          >
            Chấp nhận
          </Button>
        )

      case FriendActionCode.UNFRIEND:
        return (
          <Button onClick={() => handleFriendAction(user.userId, FriendActionCode.UNFRIEND)} variant='outline-danger'>
            Hủy kết bạn
          </Button>
        )

      case FriendActionCode.MESSAGE:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.MESSAGE)}
            style={{ backgroundColor: '#4C68D5' }}
          >
            Nhắn tin
          </Button>
        )

      default:
        return (
          <Button
            onClick={() => handleFriendAction(user.userId, FriendActionCode.SEND_REQUEST)}
            style={{ backgroundColor: '#4C68D5' }}
          >
            Kết bạn
          </Button>
        )
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm bạn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmitSearchFriend}>
          <div className='d-flex align-items-center mb-3'>
            <div className='dropdown me-2'>
              <button className='btn btn-outline-secondary dropdown-toggle d-flex align-items-center' type='button'>
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png'
                  alt='Vietnam'
                  width='20'
                  className='me-2'
                />
                (+84)
              </button>
            </div>
            <input
              type='text'
              className='form-control'
              placeholder='Số điện thoại / Email'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type='submit' className='btn btn-primary ms-2' style={{ backgroundColor: '#4C68D5' }}>
              <BsSearch />
            </button>
          </div>

          {error && <div className='text-danger'>{error}</div>}

          {result && (
            <div className='d-flex align-items-center justify-content-between p-2 border-bottom'>
              <div className='d-flex align-items-center'>
                <img
                  src={result.avatar}
                  className='rounded-circle me-3 object-fit-cover'
                  width='50'
                  height='50'
                  alt=''
                />
                <div>
                  <div>{result.displayName}</div>
                  <small className='text-muted'>{result.username}</small>
                </div>
              </div>
              {renderActionButton(result)}
            </div>
          )}
        </form>

        <div className='mt-4'>
          <h6>Kết quả gần nhất</h6>
          <div className='friend-suggestions'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='d-flex align-items-center justify-content-between p-2 border-bottom'>
                <div className='d-flex align-items-center'>
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s`}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt=''
                  />
                  <div>
                    <div>Tên người dùng {item}</div>
                    <small className='text-muted'>(+84) 090 xxx xxx</small>
                  </div>
                </div>
                <Button style={{ backgroundColor: '#4C68D5' }}>Kết bạn</Button>
              </div>
            ))}
          </div>

          <div className='mt-3'>
            <h6>Có thể bạn quen</h6>
            {[4, 5, 6].map((item) => (
              <div key={item} className='d-flex align-items-center justify-content-between p-2 border-bottom'>
                <div className='d-flex align-items-center'>
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s`}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt=''
                  />
                  <div>
                    <div>Tên người dùng {item}</div>
                    <small className='text-muted'>Từ gợi ý kết bạn</small>
                  </div>
                </div>
                <Button style={{ backgroundColor: '#4C68D5' }} variant='primary'>
                  Kết bạn
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Hủy
        </Button>
        <Button style={{ backgroundColor: '#4C68D5' }} onClick={handleSubmitSearchFriend} variant='primary'>
          Tìm kiếm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
