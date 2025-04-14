export type Role = 'ADMIN' | 'USER'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK'

export interface User {
  id: string // đổi từ _id nếu backend trả về "id"
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  dob?: string // ISO 8601
  status: UserStatus
  role: Role
  authProvider: AuthProvider
  createdAt: string
  updatedAt: string
  nickname?: string
}

export interface UserDTO {
  userId: string
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  dob?: string // ISO 8601
  status: UserStatus
  role: Role
  authProvider: AuthProvider
  createdAt: string
  updatedAt: string
  nickname?: string
}
