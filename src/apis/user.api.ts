import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt' | 'email' | 'authProvider' | 'username' | 'status' > {
  password?: string
  newPassword?: string
}

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>('ola-chat/users/my-info')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('ola-chat/users/my-update', body)
  },
  uploadAvatar(body: FormData) {
    return http.put<SuccessResponse<string>>('ola-chat/users/my-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
