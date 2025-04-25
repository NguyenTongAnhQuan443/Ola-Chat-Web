import React, { useEffect, useRef, useState } from 'react'

interface MessageActionsProps {
  onForward: () => void
  onReact: () => void
  onMoreOptions: () => void
}

const MessageActions = ({ onForward, onReact, onMoreOptions }: MessageActionsProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className='message-actions'>
      <svg
        onClick={onForward}
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
        onMouseEnter={onReact}
        fill='#b0b0b0'
        viewBox='0 0 1000 1000'
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        className='action-icon'
      >
        <path d='M500 70q-117 0-217 59-97 57-154 154-59 100-59 217t59 217q57 97 154 154 100 59 217 59t217-59q97-57 154-154 59-100 59-217t-59-217q-57-97-154-154-100-59-217-59zm189 233q21 0 38.5 12t25.5 31.5 4 40-19 35.5-36 19.5-40.5-4-31-26T619 373q0-29 20.5-49.5T689 303zm-377 0q29 0 49 20.5t20 49.5-20 49.5-49 20.5-49.5-20.5T242 373t20.5-49.5T311 303h1zm472 255q-9 70-49.5 126.5t-102 89T500 806t-132.5-32.5-102-89T216 558q-2-15 8.5-27t25.5-12h500q15 0 25.5 12t8.5 27z' />
      </svg>

      <svg
        onClick={onMoreOptions}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        className='action-icon'
      >
        <circle cx='18' cy='12' r='1.5' transform='rotate(90 18 12)' fill='#b0b0b0' />
        <circle cx='12' cy='12' r='1.5' transform='rotate(90 12 12)' fill='#b0b0b0' />
        <circle cx='6' cy='12' r='1.5' transform='rotate(90 6 12)' fill='#b0b0b0' />
      </svg>
    </div>
  )
}

export default MessageActions
