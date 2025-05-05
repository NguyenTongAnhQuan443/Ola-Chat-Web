import http from "src/utils/http"

export const URL_CREATE_GROUP = 'ola-chat/api/groups'

const groupAPI = {
    createGroup(name: string, avatar: string, userIds: string[]) {
        return http.post(URL_CREATE_GROUP, {
            name,
            avatar,
            userIds
        })
    }
}

export default groupAPI