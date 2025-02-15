"use client"

import type React from "react";
import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Add type declaration for sockjs-client
// declare module 'sockjs-client';

interface Message {
  id: string
  senderId: number
  conversationId: string
  content: string
  type: string
  mediaUrl: string | null
  status: string
  deliveryStatus: Array<Record<string, unknown>>
  readStatus: Array<Record<string, unknown>>
  createdAt: string
}

interface LastMessage {
  messageId: string | null
  content: string
  createdAt: string | null
}

interface Conversation {
  id: string
  name: string
  avatar: string | null
  type: string
  lastMessage: LastMessage
  createdAt: string
  updatedAt: string
}

interface User {
  id: number
  username: string
  password: string
  displayName: string
  email: string
  avatar: string
  status: string
  createdAt: string
  updatedAt: string
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  
  // Ref for stompClient
  const stompClient = useRef<Client | null>(null)

  // Get current user from localStorage and connect to WebSocket
  useEffect(() => {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      fetch(`http://localhost:8080/api/users`)
        .then(response => response.json())
        .then(data => {
          setUsers(data)
          const user = data.find((u: User) => u.id === parseInt(userId))
          if (user) {
            setCurrentUser(user)
            connectToWebSocket(user.id)
          }
        })
        .catch(error => console.error('Error fetching users:', error))
    }
    
    // Cleanup function to disconnect WebSocket
    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
      }
    }
  }, [])

  // Connect to WebSocket
  const connectToWebSocket = (userId: number) => {
    const socket = new SockJS('http://localhost:8080/ws')
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      }
    });
    
    stompClient.current.onConnect = () => {
      console.log("Connected to WebSocket")
      
      // Subscribe to all conversations
      if (stompClient.current && conversations.length > 0) {
        conversations.forEach(conversation => {
          subscribeToConversation(conversation.id);
        });
      }
    };
    
    stompClient.current.onStompError = onError;
    stompClient.current.activate();
  }

  // Subscribe to specific conversation
  const subscribeToConversation = (conversationId: string) => {
    if (stompClient.current && stompClient.current.active) {
      stompClient.current.subscribe(`/user/${conversationId}/private`, onMessageReceived);
    }
  }

  // Subscribe to new conversations when the list changes
  useEffect(() => {
    if (stompClient.current && stompClient.current.active && conversations.length > 0) {
      conversations.forEach(conversation => {
        subscribeToConversation(conversation.id);
      });
    }
  }, [conversations]);

  // Handle WebSocket errors
  const onError = (err: any) => {
    console.error("WebSocket Error:", err)
  }

  // Handle received messages from WebSocket
  const onMessageReceived = (payload: any) => {
    const receivedMessage = JSON.parse(payload.body) as Message
    
    // Add message to current conversation if it belongs there
    if (selectedConversation && receivedMessage.conversationId === selectedConversation.id) {
      setMessages(prevMessages => [...prevMessages, receivedMessage])
    }
    
    // Update last message in conversations list
    updateConversationWithLastMessage(receivedMessage)
  }
  
  // Update conversation list with new last message
  const updateConversationWithLastMessage = (message: Message) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: {
              messageId: message.id,
              content: message.content,
              createdAt: message.createdAt
            }
          }
        }
        return conv
      })
    )
  }

  // Fetch conversations
  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:8080/api/conversations?userId=${currentUser.id}`)
        .then(response => response.json())
        .then(data => {
          setConversations(data)
          if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0])
          }
        })
        .catch(error => console.error('Error fetching conversations:', error))
    }
  }, [currentUser, selectedConversation])

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      fetch(`http://localhost:8080/api/conversations/${selectedConversation.id}/messages`)
        .then(response => response.json())
        .then(data => {
          setMessages(data)
        })
        .catch(error => console.error('Error fetching messages:', error))
    }
  }, [selectedConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !selectedConversation) return

    // Create new message object to send
    const messageToSend = {
      senderId: currentUser.id,
      conversationId: selectedConversation.id,
      content: newMessage,
      type: "TEXT",
      status: "SENT",
      createdAt: new Date().toISOString()
    }

    if (stompClient.current && stompClient.current.active) {
      // Send message through WebSocket
      stompClient.current.publish({
        destination: "/app/private-message",
        body: JSON.stringify(messageToSend)
      });
      
      // Optimistically add message to UI
      const optimisticMessage = {
        ...messageToSend,
        id: crypto.randomUUID(), // Generate a temporary ID
        mediaUrl: null,
        deliveryStatus: [],
        readStatus: []
      } as Message
      
      setMessages(prevMessages => [...prevMessages, optimisticMessage])
      
      // Update last message in conversation list
      updateConversationWithLastMessage(optimisticMessage)
    } else {
      // Fallback to REST API if WebSocket is not connected
      fetch(`http://localhost:8080/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageToSend),
      })
        .then(response => response.json())
        .then(data => {
          setMessages(prevMessages => [...prevMessages, data])
          updateConversationWithLastMessage(data)
        })
        .catch(error => console.error('Error sending message:', error))
    }

    setNewMessage("")
  }

  // Helper function to get user display name by ID
  const getUserDisplayName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? user.displayName : "Unknown User"
  }

  // Helper function to get user avatar by ID
  const getUserAvatar = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user?.avatar || "/placeholder.svg"
  }

  // Format timestamp to readable time
  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Extract id for key props (handles both string IDs and object IDs)
  const getKeyFromId = (id: any): string => {
    if (typeof id === 'string') return id
    if (id && typeof id === 'object' && 'timestamp' in id) return id.timestamp.toString()
    return String(id)
  }

  if (!currentUser) {
    return <div className="d-flex justify-content-center align-items-center h-100">Loading...</div>
  }

  return (
    <div className="d-flex h-100">
      {/* Conversations List */}
      <div className="chat-list border-end" style={{ maxWidth: "320px" }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
          <h6 className="mb-0">Messages</h6>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Online
            </span>
            <button className="btn btn-link text-dark p-0">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>

        <div className="chat-list-content">
          {conversations.map((conversation) => (
            <div
              key={getKeyFromId(conversation.id)}
              className={`d-flex align-items-center px-4 py-3 border-bottom chat-item 
                ${selectedConversation?.id === conversation.id ? "bg-light" : ""}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="position-relative">
                <img
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              </div>
              <div className="ms-3 overflow-hidden">
                <p className="mb-0 text-dark" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {conversation.name}
                </p>
                <p className="mb-0 text-muted text-truncate" style={{ fontSize: "13px" }}>
                  {conversation.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="new-message-section border-top px-4 py-3 bg-white">
          <div className="d-flex align-items-center text-muted" style={{ fontSize: "14px", cursor: "pointer" }}>
            <i className="far fa-edit me-2"></i>
            New Message
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="chat-area flex-grow-1 d-flex flex-column bg-light" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="px-4 py-3 bg-white border-bottom">
            <div className="d-flex align-items-center">
              <img
                src={selectedConversation.avatar || "/placeholder.svg"}
                alt={selectedConversation.name}
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <div className="ms-3">
                <p className="mb-0" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {selectedConversation.name}
                </p>
                <span className="text-muted" style={{ fontSize: "13px" }}>
                  {selectedConversation.type}
                </span>
              </div>
            </div>
          </div>

          <div className="chat-messages flex-grow-1 p-4 overflow-auto">
            {messages.map((message) => (
              <div 
                key={getKeyFromId(message.id)} 
                className={`d-flex mb-4 ${message.senderId === currentUser.id ? "justify-content-end" : ""}`}
              >
                {message.senderId !== currentUser.id && (
                  <img
                    src={getUserAvatar(message.senderId)}
                    alt={getUserDisplayName(message.senderId)}
                    className="rounded-circle align-self-end"
                    style={{ width: "28px", height: "28px", objectFit: "cover" }}
                  />
                )}
                <div 
                  className={`${message.senderId !== currentUser.id ? "ms-2" : "me-2"}`} 
                  style={{ maxWidth: "80%" }}
                >
                  <div
                    className={`rounded-4 px-3 py-2 ${message.senderId === currentUser.id ? "text-white" : "bg-white"}`}
                    style={{
                      backgroundColor: message.senderId === currentUser.id ? "#4F46E5" : undefined,
                      fontSize: "14px",
                    }}
                  >
                    <p className="mb-0">{message.content}</p>
                  </div>
                  <div className="text-end mt-1">
                    <small className="text-muted" style={{ fontSize: "12px" }}>
                      {formatTime(message.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input px-4 py-3 bg-white border-top">
            <form onSubmit={handleSendMessage}>
              <div className="position-relative d-flex align-items-center">
                <input
                  type="text"
                  className="form-control bg-light border-0 rounded-pill"
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    fontSize: "14px",
                    paddingRight: "40px",
                    height: "40px",
                  }}
                />
                <button
                  type="submit"
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                  style={{ color: "#4F46E5" }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="chat-area flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <p className="text-muted">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  )
}

export default Messages;