import { Conversation, Message } from "src/types/message.type"
import http from "src/utils/http"
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import config from "src/constants/config"
import { get } from "lodash"
import { SuccessResponse } from "src/types/utils.type"

export const BASE_URL = 'ola-chat/api/conversations'

let stompClient: Client | null = null

const messageAPI = {
  getConversations(userId?: string) {
    return http.get<SuccessResponse<Conversation[]>>(`${BASE_URL}?userId=${userId}`)
  },

  getMessages(conversationId: string) {
    return http.get<Message[]>( `${BASE_URL}/${conversationId}/messages`)
  },
  
  connectToWebSocket(
    conversationIds: string[], 
    onMessageReceived: (conversationId: string, message: any) => void
  ) {
    // Đóng kết nối cũ nếu có
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
    }
    
    const socket = new SockJS(`${config.baseUrl}ola-chat/ws`)
    stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str)
      },
      reconnectDelay: 5000
    })

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket')

      conversationIds.forEach((conversationId) => {
        stompClient?.subscribe(`/user/${conversationId}/private`, (message) => {
          const newMsg = JSON.parse(message.body)
          console.log('📥 Nhận tin nhắn mới:', newMsg)
          
          // Gọi callback để component xử lý
          onMessageReceived(conversationId, newMsg)
        })
      })
    }

    stompClient.activate()
    return stompClient
  },
  
  disconnectWebSocket() {
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
      stompClient = null
      console.log('WebSocket disconnected')
    }
  },
  
  sendMessage(conversationId: string, message: any) {
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: `/app/chat/${conversationId}`,
        body: JSON.stringify(message)
      })
      return true
    } else {
      console.error('WebSocket không được kết nối')
      return false
    }
  },
  
  // Lấy Client hiện tại (nếu cần sử dụng bên ngoài)
  getStompClient() {
    return stompClient
  }
}

export default messageAPI