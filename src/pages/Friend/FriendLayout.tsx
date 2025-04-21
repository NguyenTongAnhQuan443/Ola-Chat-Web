import { NavLink, Outlet } from 'react-router-dom'
import { HiOutlineUserGroup, HiOutlineUserAdd } from 'react-icons/hi'
import { BsSearch, BsPersonPlus } from 'react-icons/bs'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { useContext, useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { User } from 'src/types/user.type'
import userApi from 'src/apis/user.api'
import { AppContext } from 'src/contexts/app.context'
import { profile } from 'console';
import friendAPI from 'src/apis/friend.api'
import { toast } from 'react-toastify'

export default function FriendLayout() {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const {profile} = useContext(AppContext)

  //Start Search Friend
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<User | null>(null)
  const [error, setError] = useState<string>('')

  const handleSubmitSearchFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    try {
      if (!query){
        toast.error('Vui lòng nhập số điện thoại hoặc email')
        return
      }
      const res = await userApi.getInfoFriend(query)
      setResult(res.data.data)
    } catch (err) {
      setError('Không tìm thấy người dùng phù hợp')
    }
  }
  //End Search Friend
  //Start add Friend
  const handleAddFriend = async (receiverId: string) => {
    try {
      if (!profile?.userId) return
      await friendAPI.sendRequestAddFriend({ senderId: profile.userId, receiverId })
      toast.success('Đã gửi lời mời kết bạn!')
    } catch (error) {
      toast.error('Không thể gửi lời mời kết bạn')
    }
  }
  //End add Friend
  

  return (
    <div className='container-fluid p-0' style={{ overflowY: 'hidden' }}>
      <div className='row g-0'>
        {/* Fixed Sidebar */}
        <div className='col-md-3' style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <div className='bg-white border-end' style={{ height: '100%', overflowY: 'auto' }}>
            <div className='p-3'>
              <div className='d-flex align-items-center mb-4'>
                <div className='input-group'>
                  <span className='input-group-text bg-light border-0'>
                    <BsSearch />
                  </span>
                  <input type='text' className='form-control bg-light border-0' placeholder='Tìm kiếm' />
                </div>
                <button className='btn btn-light ms-2' title='Thêm bạn' onClick={() => setShowAddFriendModal(true)}>
                  <BsPersonPlus />
                </button>
                <button className='btn btn-light ms-2' title='Tạo nhóm' onClick={() => setShowCreateGroupModal(true)}>
                  <AiOutlineUsergroupAdd />
                </button>
              </div>
              <ul className='nav flex-column'>
                <li className='nav-item mb-2'>
                  <NavLink
                    to=''
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-medium ${isActive ? 'text-dark bg-light rounded' : 'text-secondary'}`
                    }
                    end
                  >
                    <HiOutlineUserGroup className='me-2' size={20} />
                    <span>Danh sách bạn bè</span>
                  </NavLink>
                </li>
                <li className='nav-item mb-2'>
                  <NavLink
                    to='groups'
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-medium ${isActive ? 'text-dark bg-light rounded' : 'text-secondary'}`
                    }
                  >
                    <HiOutlineUserGroup className='me-2' size={20} />
                    <span>Danh sách nhóm và cộng đồng</span>
                  </NavLink>
                </li>
                <li className='nav-item mb-2'>
                  <NavLink
                    to='invites'
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-medium ${isActive ? 'text-dark bg-light rounded' : 'text-secondary'}`
                    }
                  >
                    <HiOutlineUserAdd className='me-2' size={20} />
                    <span>Lời mời kết bạn</span>
                  </NavLink>
                </li>
                <li className='nav-item mb-2'>
                  <NavLink
                    to='group-invites'
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-medium ${isActive ? 'text-dark bg-light rounded' : 'text-secondary'}`
                    }
                  >
                    <HiOutlineUserGroup className='me-2' size={20} />
                    <span>Lời mời vào nhóm và cộng đồng</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className='col-md-9 bg-white' style={{ height: '100vh', overflowY: 'auto' }}>
          <div className='p-4'>
            <Outlet />
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      <Modal show={showAddFriendModal} onHide={() => setShowAddFriendModal(false)}>
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
                  <img src={result.avatar} className='rounded-circle me-3' width='40' height='40' alt='' />
                  <div>
                    <div>{result.displayName}</div>
                    <small className='text-muted'>{result.username}</small>
                  </div>
                </div>
                <Button onClick={() => handleAddFriend(result.userId)} variant='primary'>Kết bạn</Button>
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
          <Button variant='secondary' onClick={() => setShowAddFriendModal(false)}>
            Hủy
          </Button>
          <Button onSubmit={handleSubmitSearchFriend} variant='primary'>
            Tìm kiếm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Group Modal */}
      <Modal show={showCreateGroupModal} onHide={() => setShowCreateGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-4'>
            <div className='d-flex align-items-center'>
              <div
                className='bg-light rounded-circle d-flex align-items-center justify-content-center me-3'
                style={{ width: 50, height: 50 }}
              >
                <i className='bi bi-camera fs-5 text-secondary'></i>
              </div>
              <Form.Control type='text' placeholder='Nhập tên nhóm...' />
            </div>
          </Form.Group>

          <InputGroup className='mb-3'>
            <InputGroup.Text>
              <BsSearch />
            </InputGroup.Text>
            <Form.Control placeholder='Nhập tên, số điện thoại, hoặc danh sách số điện thoại' />
          </InputGroup>

          <div className='d-flex mb-3 flex-wrap'>
            <Button variant='primary' size='sm' className='me-2 mb-2'>
              Tất cả
            </Button>
            <Button variant='outline-secondary' size='sm' className='me-2 mb-2'>
              gr chat
            </Button>
            <Button variant='outline-secondary' size='sm' className='me-2 mb-2'>
              Gia đình
            </Button>
            <Button variant='outline-secondary' size='sm' className='me-2 mb-2'>
              Công việc
            </Button>
            <Button variant='outline-secondary' size='sm' className='me-2 mb-2'>
              Bạn bè
            </Button>
            <Button variant='outline-secondary' size='sm' className='mb-2'>
              Trả lời sau
            </Button>
          </div>

          <div>
            <h6>Trò chuyện gần đây</h6>
            <div className='friend-list'>
              {['Ngô Văn Toàn', 'ĐH Trường Sinh', 'Thùy Vy', 'ĐH Lợi', 'Bảo Thông'].map((name, index) => (
                <div key={index} className='d-flex align-items-center p-2 border-bottom'>
                  <Form.Check type='checkbox' className='me-3' />
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s`}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt=''
                  />
                  <span>{name}</span>
                </div>
              ))}
            </div>

            <h6 className='mt-3'>A</h6>
            <div className='friend-list'>
              {['Anh Hải', 'Anh Ngữ An Toàn', 'Anh Thư'].map((name, index) => (
                <div key={index} className='d-flex align-items-center p-2 border-bottom'>
                  <Form.Check type='checkbox' className='me-3' />
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s`}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt=''
                  />
                  <span>{name}</span>
                </div>
              ))}
            </div>

            <h6 className='mt-3'>B</h6>
            <div className='friend-list'>
              {['Bảo Thông'].map((name, index) => (
                <div key={index} className='d-flex align-items-center p-2 border-bottom'>
                  <Form.Check type='checkbox' className='me-3' />
                  <img
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s`}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                    alt=''
                  />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowCreateGroupModal(false)}>
            Hủy
          </Button>
          <Button variant='primary'>Tạo nhóm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
