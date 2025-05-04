import { useContext, useEffect, useState } from 'react'
import Conversations from './containers/conversations'
import ChatBox from './containers/mainChat/chatBox'
import { UserDTO } from 'src/types/user.type'
import { Conversation } from 'src/types/message.type'
import { AppContext } from 'src/contexts/app.context'

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const {profile} = useContext(AppContext)

  // Xử lý khi người dùng nhấn vào một cuộc trò chuyện
  const handleSelectConversation = (conversationId: Conversation) => {
    setSelectedConversation(conversationId)
  }

  return (
    <div className='d-flex flex-row w-full h-full' style={{ minHeight: '500px' }}>
      <Conversations onPress={handleSelectConversation} />
      <ChatBox selectedConversation={selectedConversation} currentUserId={profile?.userId || ''} />
    </div>
  )
}

export default Messages
