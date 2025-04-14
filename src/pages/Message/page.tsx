import Conversations from './containers/conversations'
import ChatBox from './containers/mainChat/chatBox'

const Messages = () => {
  return (
    <>
      <div className='flex flex-row w-full h-full'>
        <Conversations />
        <ChatBox />
      </div>
    </>
  )
}

export default Messages
