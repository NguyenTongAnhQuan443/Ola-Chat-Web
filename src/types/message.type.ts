interface Message {
    id: string
    senderId: string
    conversationId: string
    content: string
    type: string
    mediaUrl: string | null
    status: string
    deliveryStatus: Array<Record<string, unknown>>
    readStatus: Array<Record<string, unknown>>
    createdAt: string
    recalled: boolean
  }
  
  interface LastMessage {
    messageId: string | null
    content: string
    createdAt: string | null
  }
  
  interface Conversation {
    id: string
    name: string
    avatar: string | null
    type: string
    lastMessage: LastMessage
    createdAt: string
    updatedAt: string
  }