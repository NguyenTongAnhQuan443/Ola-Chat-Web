import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const useChatWebSocket = ({
  destination,
  onMessage,
}: {
  destination: string
  onMessage: (msg: any) => void
  onRecallSuccess?: () => void
}) => {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ola-chat/ws')
    const client = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      reconnectDelay: 5000
    })

    client.onConnect = () => {
      client.subscribe(destination, (message) => {
        onMessage(JSON.parse(message.body))
      })
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [destination, onMessage])

  const sendMessage = ( body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination: '/app/private-message', body: JSON.stringify(body) })
    }
  }

  const recallMessage = (messageId: string, senderId: string) => {
    if (clientRef.current?.connected) {
      const recallRequest = {
        id: messageId,
        senderId: senderId
      }
      clientRef.current.publish({
        destination: '/app/recall-message',
        body: JSON.stringify(recallRequest)
      })
    }
  }

  return { sendMessage, recallMessage }
}
