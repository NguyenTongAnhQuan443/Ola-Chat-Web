// src/contexts/websocket.context.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import config from '../constants/config'

interface WebSocketContextType {
  connected: boolean
  subscribe: (destination: string, callback: (message: any) => void) => string | null
  unsubscribe: (subscriptionId: string) => void
  publishMessage: (destination: string, body: any) => void
  recallMessage: (messageId: string, senderId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  subscribe: () => null,
  unsubscribe: () => {},
  publishMessage: () => {},
  recallMessage: () => {}
})

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)
  const subscriptionsRef = useRef<{ [key: string]: { id: string; callback: (message: any) => void } }>({})

  useEffect(() => {
    const socket = new SockJS(`${config.baseUrl}/ola-chat/ws`)
    const client = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      reconnectDelay: 5000
    })

    client.onConnect = () => {
      console.log('WebSocket connected')
      setConnected(true)
      
      // Đăng ký lại các subscription
      Object.entries(subscriptionsRef.current).forEach(([destination, { callback }]) => {
        const subscription = client.subscribe(destination, (message) => {
          try {
            const parsedBody = JSON.parse(message.body)
            callback(parsedBody)
          } catch (e) {
            console.error('Error parsing message:', e)
          }
        })
        subscriptionsRef.current[destination].id = subscription.id
      })
    }

    client.onDisconnect = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (!clientRef.current?.connected) {
      // Lưu vào subscriptionsRef để đăng ký lại khi kết nối
      subscriptionsRef.current[destination] = { id: '', callback }
      return null
    }

    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const parsedBody = JSON.parse(message.body)
        callback(parsedBody)
      } catch (e) {
        console.error('Error parsing message:', e)
      }
    })

    subscriptionsRef.current[destination] = { id: subscription.id, callback }
    return subscription.id
  }

  const unsubscribe = (subscriptionId: string) => {
    if (!clientRef.current?.connected) return

    clientRef.current.unsubscribe(subscriptionId)
    
    // Remove from subscriptions
    Object.keys(subscriptionsRef.current).forEach(key => {
      if (subscriptionsRef.current[key].id === subscriptionId) {
        delete subscriptionsRef.current[key]
      }
    })
  }

  const publishMessage = (destination: string, body: any) => {
    if (!clientRef.current?.connected) {
      console.error('Cannot send message, WebSocket not connected')
      return
    }

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body)
    })
  }

  const recallMessage = (messageId: string, senderId: string) => {
    if (!clientRef.current?.connected) return

    const recallRequest = {
      id: messageId,
      senderId: senderId
    }

    clientRef.current.publish({
      destination: '/app/recall-message',
      body: JSON.stringify(recallRequest)
    })
  }

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        subscribe,
        unsubscribe,
        publishMessage,
        recallMessage
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}