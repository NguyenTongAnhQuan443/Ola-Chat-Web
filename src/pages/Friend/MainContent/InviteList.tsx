import React, { useState, useEffect } from 'react'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { FiMessageSquare } from 'react-icons/fi'
import { BsChevronRight } from 'react-icons/bs'
import friendAPI from 'src/apis/friend.api'

interface FriendRequest {
  id: string
  name: string
  avatar: string
  date: string
  message: string
  source: string
}

export default function InviteList() {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
  const [suggestions, setSuggestions] = useState<number>(50)

  useEffect(() => {
    const getListRequest = async () => {
      try {
        const [receivedRes, sentRes] = await Promise.all([
          friendAPI.getListRequestReceived(),
          friendAPI.getListRequestSent()
        ])
        setReceivedRequests(
          receivedRes.data.data.map((req) => ({
            id: req.userId,
            name: req.displayName,
            avatar:
              req.avatar ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
            date: '',
            message: '',
            source: ''
          }))
        )
        setSentRequests(
          sentRes.data.data.map((req) => ({
            id: req.userId,
            name: req.displayName,
            avatar:
              req.avatar ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s',
            date: '',
            message: '',
            source: ''
          }))
        )
      } catch (err) {
        console.error('Error fetching friend requests:', err)
      }
    }

    getListRequest()
  }, [])

  const handleAccept = async (id: string) => {
    try {
      await friendAPI.acceptRequest(id)
      setReceivedRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (error) {
      console.error('Lỗi khi chấp nhận lời mời:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await friendAPI.rejectRequest(id)
      setReceivedRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (error) {
      console.error('Lỗi khi từ chối lời mời:', error)
    }
  }

  const handleCancel = (id: string) => {
    // Logic to cancel sent friend request
    setSentRequests(sentRequests.filter((req) => req.id !== id))
    // API call to cancel friend request
  }

  return (
    <div className='friend-invites'>
      <div className='d-flex align-items-center mb-4'>
        <HiOutlineUserAdd size={24} className='me-2' />
        <h5 className='mb-0'>Lời mời kết bạn</h5>
      </div>

      {/* Received friend requests */}
      <div className='mb-5'>
        <h6 className='mb-3'>Lời mời đã nhận ({receivedRequests.length})</h6>

        {receivedRequests.length === 0 ? (
          <div className='text-center py-4 bg-light rounded'>
            <p className='text-muted mb-0'>Không có lời mời nào</p>
          </div>
        ) : (
          <div className='row'>
            {receivedRequests.map((request) => (
              <div className='col-12 col-md-6 mb-3' key={request.id}>
                <div className='bg-white rounded shadow-sm p-3'>
                  <div className='d-flex mb-3'>
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className='rounded-circle me-3'
                      width='50'
                      height='50'
                    />
                    <div>
                      <h6 className='mb-1'>{request.name}</h6>
                      <div className='text-muted small d-flex align-items-center'>
                        <span>{request.date}</span>
                        <span className='mx-1'>•</span>
                        <span>{request.source}</span>
                      </div>
                    </div>
                    <div className='ms-auto'>
                      <button className='btn btn-link text-secondary p-0'>
                        <FiMessageSquare size={20} />
                      </button>
                    </div>
                  </div>

                  <div className='bg-light p-2 rounded mb-3 small'>{request.message}</div>

                  <div className='d-flex'>
                    <button className='btn btn-light flex-grow-1 me-2' onClick={() => handleReject(request.id)}>
                      Từ chối
                    </button>
                    <button className='btn btn-primary flex-grow-1' onClick={() => handleAccept(request.id)}>
                      Đồng ý
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent friend requests */}
      <div className='mb-5'>
        <h6 className='mb-3'>Lời mời đã gửi ({sentRequests.length})</h6>

        {sentRequests.length === 0 ? (
          <div className='text-center py-4 bg-light rounded'>
            <p className='text-muted mb-0'>Không có lời mời nào</p>
          </div>
        ) : (
          <div className='row'>
            {sentRequests.map((request) => (
              <div className='col-12 col-md-6 mb-3' key={request.id}>
                <div className='bg-white rounded shadow-sm p-3'>
                  <div className='d-flex mb-3'>
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className='rounded-circle me-3'
                      width='50'
                      height='50'
                    />
                    <div>
                      <h6 className='mb-1'>{request.name}</h6>
                      <div className='text-muted small'>
                        <span>{request.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex'>
                    <button className='btn btn-light flex-grow-1' onClick={() => handleCancel(request.id)}>
                      Thu hồi lời mời
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend suggestions */}
      <div className='mb-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h6 className='mb-0'>Gợi ý kết bạn ({suggestions})</h6>
          <button className='btn btn-link text-primary p-0 d-flex align-items-center'>
            <span>Xem thêm</span>
            <BsChevronRight />
          </button>
        </div>

        <div className='text-center py-4 bg-light rounded'>
          <p className='text-muted mb-0'>Không có gợi ý nào</p>
        </div>
      </div>
    </div>
  )
}
