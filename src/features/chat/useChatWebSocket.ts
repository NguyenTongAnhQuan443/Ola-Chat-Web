import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const useChatWebSocket = ({
  url,
  destination,
  onMessage
}: {
  url: string
  destination: string
  onMessage: (msg: any) => void
}) => {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS(url)
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
  }, [url, destination, onMessage])

  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) })
    }
  }

  return { sendMessage }
}
