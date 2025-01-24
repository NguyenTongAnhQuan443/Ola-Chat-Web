import { useState } from "react"
import { NewMessageModal } from "./NewMessageModal"

export function ChatList() {
  const [showModal, setShowModal] = useState(false)

  const chats = [
    {
      id: 1,
      name: "Bessie Cooper",
      message: "Hi, Robert. I'm facing some chall...",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "12:45 PM",
    },
    {
      id: 2,
      name: "Thomas Baker",
      message: "I have a job interview coming up...",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "11:30 AM",
    },
    {
      id: 3,
      name: "Daniel Brown",
      message: "Not much, just planning to relax...",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "10:15 AM",
    },
    {
      id: 4,
      name: "Ronald Richards",
      message: "I'm stuck on this bug in the code...",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "9:30 AM",
    },
  ]

  const handleSelectPerson = (person: any) => {
    console.log("Selected person:", person)
    setShowModal(false)
  }

  return (
    <div className="border-end h-100" style={{ width: "320px" }}>
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Messages</h5>
        <button className="btn btn-primary rounded-pill btn-sm px-3" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>
          New Message
        </button>
      </div>
      <div className="overflow-auto" style={{ height: "calc(100vh - 160px)" }}>
        {chats.map((chat) => (
          <a key={chat.id} href="#" className="chat-item d-flex align-items-center p-3 text-dark text-decoration-none">
            <img
              src={chat.avatar || "/placeholder.svg"}
              alt={chat.name}
              className="rounded-circle me-3"
              width={40}
              height={40}
            />
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 text-truncate">{chat.name}</h6>
                <small className="text-muted ms-2">{chat.time}</small>
              </div>
              <p className="mb-0 small text-muted text-truncate">{chat.message}</p>
            </div>
          </a>
        ))}
      </div>

      <NewMessageModal show={showModal} onHide={() => setShowModal(false)} onSelect={handleSelectPerson} />
    </div>
  )
}

