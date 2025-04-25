import React, { useEffect, useRef, useState } from 'react'

interface MessageActionsProps {}

const emojiList = ['❤️', '😆', '😮', '😢', '😡', '👍', '👎']

const MessageActions = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleForward = () => {
    console.log('Forward action triggered')
    // Xử lý hành động Forward tại đây
  }

  const handleReact = () => {
    console.log('React action triggered')
    // Xử lý hành động React tại đây
  }

  const handleMoreOptions = () => {
    console.log('More options action triggered')
    // Xử lý hành động More Options tại đây
  }

  const handleCopy = () => {
    console.log('Copy action triggered')
    setShowDropdown(false)
    // Thêm logic copy nội dung tại đây
  }

  const handleRevoke = () => {
    console.log('Revoke action triggered')
    setShowDropdown(false)
    // Thêm logic thu hồi tin nhắn tại đây
  }

  return (
    <div className='message-actions'>
      <svg
        onClick={handleForward}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        className='action-icon'
      >
        <path
          d='M7 17L17 7M17 7H8M17 7V16'
          stroke='#b0b0b0'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>

      <svg
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        fill='#b0b0b0'
        viewBox='0 0 1000 1000'
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        className='action-icon'
      >
        <path d='M500 70q-117 0-217 59-97 57-154 154-59 100-59 217t59 217q57 97 154 154 100 59 217 59t217-59q97-57 154-154 59-100 59-217t-59-217q-57-97-154-154-100-59-217-59zm189 233q21 0 38.5 12t25.5 31.5 4 40-19 35.5-36 19.5-40.5-4-31-26T619 373q0-29 20.5-49.5T689 303zm-377 0q29 0 49 20.5t20 49.5-20 49.5-49 20.5-49.5-20.5T242 373t20.5-49.5T311 303h1zm472 255q-9 70-49.5 126.5t-102 89T500 806t-132.5-32.5-102-89T216 558q-2-15 8.5-27t25.5-12h500q15 0 25.5 12t8.5 27z' />
      </svg>

      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className='mt-1'
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 15,
            padding: '6px 8px',
            display: 'flex',
            gap: '8px',
            top: '100%',
            left: 0
          }}
        >
          {emojiList.map((emoji) => (
            <span
              key={emoji}
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'transform 0.1s ease-in-out'
              }}
              onClick={() => {
                console.log(`Reacted with: ${emoji}`)
                setShowEmojiPicker(false)
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}

      <div ref={dropdownRef} className='position-relative'>
        <svg
          onClick={() => setShowDropdown((prev) => !prev)}
          viewBox='0 0 24 24'
          fill='none'
          width='20'
          height='20'
          className='action-icon'
        >
          <circle cx='18' cy='12' r='1.5' transform='rotate(90 18 12)' fill='#b0b0b0' />
          <circle cx='12' cy='12' r='1.5' transform='rotate(90 12 12)' fill='#b0b0b0' />
          <circle cx='6' cy='12' r='1.5' transform='rotate(90 6 12)' fill='#b0b0b0' />
        </svg>

        {showDropdown && (
          <div
            className='dropdown-menu show'
            style={{ display: 'block', position: 'absolute', top: '120%', left: 0, zIndex: 1000 }}
          >
            <button className='dropdown-item' onClick={handleCopy}>
              📋 Copy
            </button>
            <button className='dropdown-item' onClick={handleRevoke}>
              🔄 Thu hồi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageActions
