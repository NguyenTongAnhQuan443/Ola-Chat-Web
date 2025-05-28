import { register } from "module"
import http from "src/utils/http"

export const URL_SU_FCM = "ola-chat/api/notifications/register-device" // body: {     "userId": "1114",     "token" : "2224",     "deviceId": "3334" }
export const URL_GET_NOTIFICATION = "ola-chat/api/notifications?page=0&size=10&sort=asc"

const notificationAPI = {
    registerFCMToken(userId: string, token: string, deviceId: string) {
        return http.post(URL_SU_FCM, {
            userId,
            token,
            deviceId
        })
    },
    getNotification() {
        return http.get(URL_GET_NOTIFICATION)
    }
}

export default notificationAPI