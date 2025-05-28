import http from 'src/utils/http'

export const BASE_URL = 'ola-chat/api/groups'

const groupAPI = {
  createGroup(name: string, avatar: string, userIds: string[]) {
    return http.post(BASE_URL, {
      name,
      avatar,
      userIds
    })
  },
  addMembers(groupId: string, userIds: string[]) {
    return http.post(`${BASE_URL}/${groupId}/add-member`, {
      userIds
    })
  },
  removeMember(groupId: string, userId: string) {
    return http.delete(`${BASE_URL}/${groupId}/remove/${userId}`)
  },
  transferOwner(groupId: string, userId: string) {
    return http.post(`${BASE_URL}/${groupId}/transfer-owner/${userId}`, {
      userId
    })
  },
  addModerator(groupId: string, userId: string) {
    return http.post(`${BASE_URL}/${groupId}/add-moderator/${userId}`, {
      userId
    })
  },
  removeModerator(groupId: string, userId: string) {
    return http.delete(`${BASE_URL}/${groupId}/remove-moderator/${userId}`)
  },
  dissolution(groupId: string) {
    return http.delete(`${BASE_URL}/${groupId}`)
  },
  leaveGroup(groupId: string) {
    return http.post(`${BASE_URL}/${groupId}/leave`)
  },
  joinGroup(groupId: string) {
    return http.post(`${BASE_URL}/${groupId}/join`)
  }
}

export default groupAPI
