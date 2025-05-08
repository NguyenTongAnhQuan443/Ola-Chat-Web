
export type RoleGroup = 'ADMIN' | 'MEMBER' | 'MODERATOR'

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
  senderId: string | null
}

export interface Participant{
    userId: string
    displayName: string
    avatar?: string
    role: RoleGroup
    joinedAt: Date
    muted: boolean
    nickname?: string
}

export interface Conversation {
  id: string
  name: string
  avatar: string | null
  type: string
  lastMessage: LastMessage
  createdAt: string
  updatedAt: string
}
