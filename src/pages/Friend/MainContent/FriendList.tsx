import React, { useEffect, useState } from 'react'
import { BsSearch, BsSortAlphaDown, BsCheck } from 'react-icons/bs'
import { FiFilter } from 'react-icons/fi'
import { FaEllipsisH } from 'react-icons/fa'
import friendAPI from 'src/apis/friend.api'
import { Friend } from 'src/types/friend.type'

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendAPI.getFriends()
        setFriends(response.data.data)
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [])

  const groupFriendsByFirstLetter = (friends: Friend[]) => {
    const grouped: { [key: string]: Friend[] } = {}

    friends.forEach((friend) => {
      const firstLetter = friend.displayName.charAt(0).toUpperCase()
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = []
      }
      grouped[firstLetter].push(friend)
    })

    return grouped
  }

  const groupedFriends = groupFriendsByFirstLetter(friends)
  const sortedLetters = Object.keys(groupedFriends).sort()

  return (
    <div className='p-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h6 className='fw-medium'>Bạn bè (169)</h6>
      </div>

      <div className='input-group mb-4'>
        <div className='input-group-prepend'>
          <span className='input-group-text bg-white border'>
            <BsSearch color='#65676B' />
          </span>
        </div>
        <input type='text' className='form-control bg-white' placeholder='Tìm bạn' />

        <div className='dropdown'>
          <button
            className='btn btn-white border d-flex align-items-center ms-2'
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            style={{ position: 'relative' }}
          >
            <BsSortAlphaDown className='me-1' /> Tên (A-Z)
          </button>
          {showSortDropdown && (
            <div className='dropdown-menu show' style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}>
              <div className='dropdown-item d-flex align-items-center'>
                <BsCheck className='me-2 text-primary' />
                <span>Tên (A-Z)</span>
              </div>
              <div className='dropdown-item'>
                <span className='ms-4'>Tên (Z-A)</span>
              </div>
            </div>
          )}
        </div>

        <div className='dropdown'>
          <button className='btn btn-white border d-flex align-items-center ms-2'>
            <FiFilter className='me-1' /> Tất cả
          </button>
        </div>
      </div>

      <div className='friend-list'>
        {sortedLetters.map((letter) => (
          <div className='alphabet-section mb-3' key={letter}>
            <h6 className='mb-3 text-muted'>{letter}</h6>
            {groupedFriends[letter].map((friend) => (
              <div
                key={friend.userId}
                className='friend-item d-flex align-items-center justify-content-between p-2 mb-2 border-bottom'
              >
                <div className='d-flex align-items-center'>
                  <img
                    src={
                      friend.avatar ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s'
                    }
                    alt={friend.displayName}
                    className='rounded-circle me-3'
                    width='40'
                    height='40'
                  />
                  <span>{friend.displayName}</span>
                </div>
                <button className='btn btn-link text-secondary border-0'>
                  <FaEllipsisH />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
