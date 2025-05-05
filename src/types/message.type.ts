import { UserDTO } from './user.type'

export interface Message {
  id: string
  senderId: string
  conversationId: string
  content: string
  type: string
  mediaUrls: string[] 
  status: string
  deliveryStatus: Array<Record<string, unknown>>
  readStatus: Array<Record<string, unknown>>
  createdAt: string
  recalled: boolean
}

export interface LastMessage {
  messageId: string | null
  content: string
  createdAt: string | null
}

export interface Conversation {
  id: string
  name: string
  avatar: string | null
  type: string
  lastMessage: LastMessage
  createdAt: string
  updatedAt: string
  users: UserDTO[]
}
