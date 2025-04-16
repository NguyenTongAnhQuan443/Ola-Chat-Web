import { useEffect, useState } from 'react'
import Conversations from './containers/conversations'
import ChatBox from './containers/mainChat/chatBox'
import { UserDTO } from 'src/types/user.type'

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null)

  useEffect(() => {
    const getCurrentUser = async () => {
      await getMyInfo()
    }

    getCurrentUser()
  }, [])

  async function getMyInfo() {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      throw new Error('Access token not found in localStorage')
    }

    try {
      const response = await fetch('http://localhost:8080/ola-chat/users/my-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      // console.log('data', data)

      setCurrentUser(data.data)

      return data.data
    } catch (error) {
      console.error('Error fetching user info:', error)
      throw error
    }
  }

  // console.log('CurUsser', currentUser?.userId)
  // Hoặc lấy từ context/auth nếu có

  const handleSelectConversation = (conversationId: string) => {
    // console.log('Selected conversationId:', conversationId)
    setSelectedConversation(conversationId)
  }

  return (
    <div className='d-flex flex-row w-full h-full' style={{ minHeight: '500px' }}>
      <Conversations onPress={handleSelectConversation} />
      <ChatBox selectedConversationID={selectedConversation} currentUserId={currentUser?.userId || ''} />
    </div>
  )
}

export default Messages
