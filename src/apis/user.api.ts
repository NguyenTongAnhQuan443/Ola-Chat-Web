import { LoginHistoryItem } from 'src/types/history.type'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile
  extends Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'email' | 'authProvider' | 'username' | 'status'> {
  password?: string
  newPassword?: string
}

export const URL_GET_PROFILE = 'ola-chat/users/my-info'
export const URL_UPDATE_PROFILE = 'ola-chat/users/my-update'
export const URL_UPLOAD_AVATAR = 'ola-chat/users/my-avatar'
export const URL_GET_HISTORY_LOGIN = 'ola-chat/api/login-history'
export const URL_GET_Info_FRIEND = 'ola-chat/users/search'

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>(URL_GET_PROFILE)
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>(URL_UPDATE_PROFILE, body)
  },
  uploadAvatar(body: FormData) {
    return http.put<SuccessResponse<string>>(URL_UPLOAD_AVATAR, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getHistoryLogin(userId: string) {
    return http.get<SuccessResponse<LoginHistoryItem[]>>(
      `${URL_GET_HISTORY_LOGIN}/${userId}`
    )
  },
  getInfoFriend(query: string) {
    return http.get<SuccessResponse<User>>(`${URL_GET_Info_FRIEND}?query=${encodeURIComponent(query)}`)
  }
  
}

export default userApi
