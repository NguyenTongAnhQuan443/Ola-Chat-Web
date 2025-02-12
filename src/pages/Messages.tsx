"use client"

import type React from "react"
import { useState } from "react"

interface Message {
  id: number
  content: string
  timestamp: string
  sender: string
}

interface Chat {
  id: number
  name: string
  role: string
  message: string
  avatar: string
  isOnline?: boolean
  messages: Message[]
}

const Messages: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Bessie Cooper",
      role: "Marketing Manager",
      message: "Hi, Robert. I'm facing some chall...",
      avatar: "https://i.pravatar.cc/150?img=1",
      isOnline: true,
      messages: [
        {
          id: 1,
          content: "Hi, Robert. I'm facing some challenges in optimizing my code for performance. Can you help?",
          timestamp: "12:45 PM",
          sender: "Bessie",
        },
        {
          id: 2,
          content:
            "Hi, Bessie 👋 I'd be glad to help you with optimizing your code for better performance. To get started, could you provide me with some more details about the specific challenges you're facing?",
          timestamp: "12:55 PM",
          sender: "Robert",
        },
      ],
    },
    {
      id: 2,
      name: "Thomas Baker",
      role: "Software Developer",
      message: "I have a job interview coming up...",
      avatar: "https://i.pravatar.cc/150?img=2",
      messages: [
        {
          id: 1,
          content: "I have a job interview coming up next week. Any tips?",
          timestamp: "11:30 AM",
          sender: "Thomas",
        },
      ],
    },
    {
      id: 3,
      name: "Daniel Brown",
      role: "UI Designer",
      message: "Not much, just planning to relax...",
      avatar: "https://i.pravatar.cc/150?img=3",
      messages: [
        {
          id: 1,
          content: "Not much, just planning to relax this weekend.",
          timestamp: "10:15 AM",
          sender: "Daniel",
        },
      ],
    },
    {
      id: 4,
      name: "Ronald Richards",
      role: "Product Manager",
      message: "I'm stuck on this bug in the code...",
      avatar: "https://i.pravatar.cc/150?img=4",
      messages: [
        {
          id: 1,
          content: "I'm stuck on this bug in the code. Could use your expertise!",
          timestamp: "09:45 AM",
          sender: "Ronald",
        },
      ],
    },
  ])

  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Tạo tin nhắn mới
    const newMsg: Message = {
      id: selectedChat.messages.length + 1, // ID tự tăng
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Giờ hiện tại
      sender: "Robert", // Bạn là người gửi tin nhắn
    }

    // Cập nhật danh sách tin nhắn của cuộc trò chuyện hiện tại
    const updatedChat = { 
      ...selectedChat, 
      messages: [...selectedChat.messages, newMsg] 
    }

    // Cập nhật danh sách chat
    setChats((prevChats) => 
      prevChats.map(chat => chat.id === selectedChat.id ? updatedChat : chat)
    )

    // Cập nhật lại cuộc trò chuyện được chọn
    setSelectedChat(updatedChat)

    // Xóa nội dung tin nhắn mới
    setNewMessage("")
  }

  return (
    <div className="d-flex h-100">
      {/* Messages List */}
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
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`d-flex align-items-center px-4 py-3 border-bottom chat-item ${selectedChat.id === chat.id ? "bg-light" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="position-relative">
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.name}
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                {chat.isOnline && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                    style={{ width: "10px", height: "10px" }}
                  ></span>
                )}
              </div>
              <div className="ms-3 overflow-hidden">
                <p className="mb-0 text-dark" style={{ fontSize: "14px", fontWeight: 500 }}>
                  {chat.name}
                </p>
                <p className="mb-0 text-muted text-truncate" style={{ fontSize: "13px" }}>
                  {chat.message}
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
      <div className="chat-area flex-grow-1 d-flex flex-column bg-light" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="px-4 py-3 bg-white border-bottom">
          <div className="d-flex align-items-center">
            <img
              src={selectedChat.avatar || "/placeholder.svg"}
              alt={selectedChat.name}
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div className="ms-3">
              <p className="mb-0" style={{ fontSize: "14px", fontWeight: 500 }}>
                {selectedChat.name}
              </p>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                {selectedChat.role}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-messages flex-grow-1 p-4 overflow-auto">
          {selectedChat.messages.map((message) => (
            <div key={message.id} className={`d-flex mb-4 ${message.sender === "Robert" ? "justify-content-end" : ""}`}>
              {message.sender !== "Robert" && (
                <img
                  src={selectedChat.avatar || "/placeholder.svg"}
                  alt={selectedChat.name}
                  className="rounded-circle align-self-end"
                  style={{ width: "28px", height: "28px", objectFit: "cover" }}
                />
              )}
              <div className={`${message.sender !== "Robert" ? "ms-2" : "me-2"}`} style={{ maxWidth: "80%" }}>
                <div
                  className={`rounded-4 px-3 py-2 ${message.sender === "Robert" ? "text-white" : "bg-white"}`}
                  style={{
                    backgroundColor: message.sender === "Robert" ? "#4F46E5" : undefined,
                    fontSize: "14px",
                  }}
                >
                  <p className="mb-0">{message.content}</p>
                </div>
                <div className="text-end mt-1">
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    {message.timestamp}
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
    </div>
  )
}

export default Messages

