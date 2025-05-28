import { SuccessResponse } from './utils.type'

export type Role = 'ADMIN' | 'USER'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK'

export interface User {
  userId: string // đổi từ _id nếu backend trả về "id"
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
export type UserResponse = SuccessResponse<{
  userId: string
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  dob?: string
  status: UserStatus
  role: Role
  authProvider: AuthProvider
  createdAt: string
  updatedAt: string
  nickname?: string
}>
