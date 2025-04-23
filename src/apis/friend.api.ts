import { get } from "lodash"
import { Friend, FriendReceived, FriendRequest } from "src/types/friend.type"
import { SuccessResponse } from "src/types/utils.type"
import http from "src/utils/http"

export const URL_GET_FRIENDS = 'ola-chat/users/my-friends' //Ds bạn bè
export const URL_SEND_REQUEST_ADDFRIEND = 'ola-chat/api/friends/send-request' //Gửi lời mời kết bạn
export const URL_GET_LIST_REQUEST_RECEIVED = 'ola-chat/api/friends/requests/received' //Ds lời mời kết bạn đã nhận
export const URL_GET_LIST_REQUEST_SENT = 'ola-chat/api/friends/requests/sent' //Ds lời mời kết bạn đã gửi

export const URL_ACCEPT_REQUEST = 'ola-chat/api/friends' //Root url để accept, reject, cancel request

const friendAPI = {
    getFriends() {
        return http.get<SuccessResponse<Friend[]>>(URL_GET_FRIENDS)
    },
    sendRequestAddFriend(body: { senderId: string; receiverId: string }) {
        return http.post<SuccessResponse<FriendRequest>>(URL_SEND_REQUEST_ADDFRIEND,body)
    },
    getListRequestReceived() {
        return http.get<SuccessResponse<FriendReceived[]>>(URL_GET_LIST_REQUEST_RECEIVED)
    },
    getListRequestSent() {
        return http.get<SuccessResponse<FriendReceived[]>>(URL_GET_LIST_REQUEST_SENT)
    },
    acceptRequest(requestId: string) {
        return http.put<SuccessResponse<null>>(`${URL_ACCEPT_REQUEST}/${requestId}/accept`)
    },
    rejectRequest(requestId: string) {
        return http.put<SuccessResponse<null>>(`${URL_ACCEPT_REQUEST}/${requestId}/reject`)
    },
}

export default friendAPI