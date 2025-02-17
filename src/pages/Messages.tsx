"use client"

import type React from "react";
import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

// Add type declaration for sockjs-client
// declare module 'sockjs-client';

interface Message {
  id: string
  senderId: string
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
  userId: string;
  username: string;
  displayName: string | null;
  email: string | null;
  avatar: string | null;
  phone: string | null;
  dob: string | null;
  status: string;
  role: string;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [partner, setPartner] = useState<{ name: string; avatar: string } | null>(null);
  
  // Ref for stompClient
  const stompClient = useRef<Client | null>(null)

  const subscriptions = useRef<{ [key: string]: StompSubscription }>({});

  // Get current user from localStorage and connect to WebSocket
  useEffect(() => {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      fetch(`http://localhost:8080/ola-chat/api/users`)
        .then(response => response.json())
        .then(data => {
          setUsers(data.data)
          const user = data.data.find((u: User) => u.userId === (userId))
          if (user) {
            setCurrentUser(user)
            connectToWebSocket(user.id)
          }
        })
        .catch(error => console.error('Error fetching users:', error))
    }
    
    // Cleanup function to disconnect WebSocket
    return () => {
      // Hủy tất cả subscriptions
      Object.values(subscriptions.current).forEach(sub => sub.unsubscribe());
      subscriptions.current = {};
      
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    }
  }, [])

  // Connect to WebSocket
  const connectToWebSocket = (userId: number) => {
    const socket = new SockJS('http://localhost:8080/ola-chat/ws')
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      }
    });
    
    stompClient.current.onConnect = () => {
      console.log("Connected to WebSocket")
    };
    
    stompClient.current.onStompError = onError;
    stompClient.current.activate();
  }

  // Subscribe to specific conversation
  const subscribeToConversation = (conversationId: string) => {
    if (stompClient.current && stompClient.current.active) {
      // Kiểm tra đã subscribe chưa
      if (!subscriptions.current[conversationId]) {
        const sub = stompClient.current.subscribe( // Subscribe to private message destination
          `/user/${conversationId}/private`,
          onMessageReceived 
        );
        subscriptions.current[conversationId] = sub;
      }
    }
  };

  // Subscribe to new conversations
  useEffect(() => {
    if (stompClient.current?.active) {
      const currentConvIds = new Set(conversations.map(c => c.id));
      
      // Unsubscribe các conversation không còn tồn tại
      Object.keys(subscriptions.current).forEach(id => {
        if (!currentConvIds.has(id)) {
          subscriptions.current[id].unsubscribe();
          delete subscriptions.current[id];
        }
      });
  
      // Subscribe conversation mới
      conversations.forEach(conv => {
        subscribeToConversation(conv.id);
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
      fetch(`http://localhost:8080/ola-chat/api/conversations?userId=${currentUser.userId}`)
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
      fetch(`http://localhost:8080/ola-chat/api/conversations/${selectedConversation.id}/messages`)
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
      senderId: currentUser.userId,
      conversationId: selectedConversation.id,
      content: newMessage,
      type: "TEXT",
      status: "SENT",
      createdAt: new Date().toISOString()
    }

    if (stompClient.current && stompClient.current.active) {
      // Send message through WebSocket
      stompClient.current.publish({
        destination: "/app/private-message", // Destination for @MessageMapping in controller
        body: JSON.stringify(messageToSend)
      });
      
    } else {
      // Fallback to REST API if WebSocket is not connected
      fetch(`http://localhost:8080/ola-chat/api/conversations/${selectedConversation.id}/messages`, {
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
  const getUserDisplayName = (userId: string) => {
    const user = users.find(u => u.userId === userId)
    return user ? user.displayName : "Unknown User"
  }

  // Helper function to get user avatar by ID
  const getUserAvatar = (userId: string) => {
    const user = users.find(u => u.userId === userId)
    return user?.avatar || "https://ui-avatars.com/api/?name=Unknown+User&background=random"
  }

  // Format timestamp to readable time
  const formatTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)

    // Lấy độ chênh lệch múi giờ của trình duyệt (tính bằng phút)
    const timezoneOffset = new Date().getTimezoneOffset();

    // Điều chỉnh thời gian bằng cách cộng độ chênh lệch múi giờ
    const adjustedDate = new Date(date.getTime() - timezoneOffset * 60000);

    return adjustedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Extract id for key props (handles both string IDs and object IDs)
  const getKeyFromId = (id: any): string => {
    if (typeof id === 'string') return id
    if (id && typeof id === 'object' && 'timestamp' in id) return id.timestamp.toString()
    return String(id)
  }

  useEffect(() => {
    const myId = sessionStorage.getItem('userId');
    fetch(`http://localhost:8080/ola-chat/api/conversations/${selectedConversation?.id}/users`)
        .then(res => res.json())
        .then(data => {
            const partnerUser = data.find((u: any) => u.userId !== myId);
            if (partnerUser) {
                setPartner({
                    name: partnerUser.displayName || partnerUser.username,
                    avatar: partnerUser.avatar
                });
            }
        })
        .catch(err => console.error('Failed to fetch partner info:', err));
  }, [selectedConversation]);

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
              <div className="position-relative d-flex align-items-center">
                <img
                  src={partner?.avatar}
                  alt="Chat partner"
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <p className="mb-0 text-dark" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {partner?.name || 'Người dùng ẩn danh'}
                </p>
              </div>
              <div className="ms-3 overflow-hidden">
                <p className="mb-0 text-dark" style={{ fontSize: "14px", fontWeight: 500, maxWidth: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conversation.lastMessage?.content}
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
                src={partner?.avatar}
                alt="Chat partner"
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <div className="ms-3">
                <p className="mb-0" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {partner?.name || 'Người dùng ẩn danh'}
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
                className={`d-flex mb-4 ${message.senderId === currentUser.userId ? "justify-content-end" : ""}`}
              >
                {message.senderId !== currentUser.userId && (
                  <img
                    src={getUserAvatar(message.senderId)}
                    alt={getUserDisplayName(message.senderId) ?? 'Unknown User'}
                    className="rounded-circle align-self-end"
                    style={{ width: "35px", height: "35px", objectFit: "cover" }}
                  />
                )}
                <div 
                  className={`${message.senderId !== currentUser.userId ? "ms-2" : "me-2"}`} 
                  style={{ maxWidth: "80%" }}
                >
                  <div
                    className={`rounded-4 px-3 py-2 ${message.senderId === currentUser.userId ? "text-white" : "bg-white"}`}
                    style={{
                      backgroundColor: message.senderId === currentUser.userId ? "#4F46E5" : undefined,
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