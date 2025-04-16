import { useEffect, useRef, useState } from 'react'
import { Message } from 'src/types/message.type'
import MessageItem from './message'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface Props {
  selectedConversationID: string | null
  currentUserId: string
}

const ChatBox = ({ selectedConversationID, currentUserId }: Props) => {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const stompClient = useRef<Client | null>(null)
  const currentConversationID = useRef<string | null>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationID) return
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      try {
        const res = await fetch(`http://localhost:8080/ola-chat/api/conversations/${selectedConversationID}/messages`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error('Fetch messages error:', err)
      }
    }

    fetchMessages()

    if (selectedConversationID !== currentConversationID.current) {
      if (stompClient.current) stompClient.current.deactivate()

      currentConversationID.current = selectedConversationID
      connectToWebSocket()
    }

    return () => {
      if (stompClient.current) stompClient.current.deactivate()
    }
  }, [selectedConversationID])

  const connectToWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ola-chat/ws')
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: () => {}
    })

    stompClient.current.onConnect = () => {
      if (selectedConversationID) {
        stompClient.current?.subscribe(`/user/${selectedConversationID}/private`, (message) => {
          const newMsg = JSON.parse(message.body)
          setMessages((prev) => [...prev, newMsg])
        })
      }
    }

    stompClient.current.activate()
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!selectedConversationID || !stompClient.current?.connected) return

    let mediaUrls: string[] = []

    try {
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append('file', file)

          const token = localStorage.getItem('accessToken')
          const res = await fetch('http://localhost:8080/ola-chat/files/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token || ''}`
            },
            body: formData
          })

          const data = await res.json()
          mediaUrls.push(data.fileUrl)
        }
      }

      const messageDTO = {
        conversationId: selectedConversationID,
        senderId: currentUserId,
        content: newMessage,
        type: mediaUrls.length > 0 ? 'MEDIA' : 'TEXT',
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : null
      }

      stompClient.current.publish({
        destination: '/app/private-message',
        body: JSON.stringify(messageDTO)
      })

      setNewMessage('')
      setSelectedFiles([])
    } catch (err) {
      console.error('Upload/send error:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const renderFilePreview = () => {
    return selectedFiles.map((file, index) => {
      const url = URL.createObjectURL(file)
      const isImage = file.type.startsWith('image')
      const isVideo = file.type.startsWith('video')

      return (
        <div key={index} className='position-relative d-inline-block me-2 mb-2'>
          {isImage ? (
            <img src={url} alt='preview' style={{ height: '100px', borderRadius: '10px', objectFit: 'cover' }} />
          ) : isVideo ? (
            <video src={url} controls style={{ height: '100px', borderRadius: '10px' }} />
          ) : (
            <p>Unsupported</p>
          )}
          <button
            type='button'
            onClick={() => removeSelectedFile(index)}
            className='btn btn-sm btn-danger position-absolute top-0 end-0'
          >
            ✕
          </button>
        </div>
      )
    })
  }

  return (
    <>
      {selectedConversationID ? (
        <div className='chat-area flex-grow-1 d-flex flex-column bg-light' style={{ maxWidth: '600px', width: '100%' }}>
          <div className='px-4 py-3 bg-white border-bottom'>
            <h5 className='mb-0'>Conversation</h5>
          </div>

          <div
            className='chat-messages flex-grow-1 p-4 overflow-auto flex flex-col gap-2'
            style={{ maxHeight: '400px' }}
          >
            {messages.map((message, index) => (
              <MessageItem
                key={message.id || `${message.senderId}-${index}`}
                message={message}
                currentUserId={currentUserId}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className='chat-input px-4 py-3 bg-white border-top'>
            <form onSubmit={handleSendMessage}>
              {selectedFiles.length > 0 && <div className='mb-2 d-flex flex-wrap'>{renderFilePreview()}</div>}

              <div className='d-flex align-items-center gap-2'>
                <label className='btn btn-light m-0 px-2 py-1' title='Chọn file'>
                  <i className='fas fa-paperclip'></i>
                  <input
                    type='file'
                    accept='image/*,video/*'
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </label>

                <input
                  type='text'
                  className='form-control bg-light border-0 rounded-pill'
                  placeholder='Message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ fontSize: '14px', height: '40px' }}
                />

                <button
                  type='submit'
                  className='btn text-white rounded-circle'
                  style={{ backgroundColor: '#4F46E5', width: '40px', height: '40px' }}
                >
                  <i className='fas fa-paper-plane'></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className='chat-area flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
          <p className='text-muted'>Select a conversation to start chatting</p>
        </div>
      )}
    </>
  )
}

export default ChatBox
