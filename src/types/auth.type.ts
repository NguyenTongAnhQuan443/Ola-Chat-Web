import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: User,
  authenticated: boolean
}>

export type RefreshTokenReponse = SuccessResponse<{ accessToken: string }>
