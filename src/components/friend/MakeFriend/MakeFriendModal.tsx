import { useState, useContext } from 'react'
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

export default function MakeFriendModal({ show, onHide }: MakeFriendModalProps) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<User | null>(null)
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
      setResult(res.data.data)
    } catch (err) {
      setError('Không tìm thấy người dùng phù hợp')
    }
  }

  const handleAddFriend = async (receiverId: string) => {
    try {
      if (!profile?.userId) return
      await friendAPI.sendRequestAddFriend({ senderId: profile.userId, receiverId })
      toast.success('Đã gửi lời mời kết bạn!')
    } catch (error) {
      toast.error('Không thể gửi lời mời kết bạn')
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
            <button type='submit' className='btn btn-primary ms-2'>
              <BsSearch />
            </button>
          </div>

          {error && <div className='text-danger'>{error}</div>}

          {result && (
            <div className='d-flex align-items-center justify-content-between p-2 border-bottom'>
              <div className='d-flex align-items-center'>
                <img src={result.avatar} className='rounded-circle me-3 object-fit-cover' width='50' height='50' alt=''/>
                <div>
                  <div>{result.displayName}</div>
                  <small className='text-muted'>{result.username}</small>
                </div>
              </div>
              <Button onClick={() => handleAddFriend(result.userId)} variant='primary'>
                Kết bạn
              </Button>
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
                <Button variant='primary'>Kết bạn</Button>
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
                <Button variant='primary'>Kết bạn</Button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Hủy
        </Button>
        <Button onClick={handleSubmitSearchFriend} variant='primary'>
          Tìm kiếm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}