import { useState } from 'react'
import './App.css'
import { SallaChatProvider } from './components/salla-chat/SallaChat.provider'
import { useSallaChat } from './components/salla-chat/SallaChat.provider'
import type { IChat, IConversation } from './types'
import type { RequestParams, RequestResponse } from './components/salla-chat/SallaChat.interface'

// Mock conversations for testing
const mockConversations: IConversation[] = [
  {
    id: "303467250",
    name: "Influencer Test Influencer",
    avatar: null,
    website_token: "d7LogLEjttVvX9jyW5srTDwE",
    status: "open",
    last_message: {
      content: "hello",
      created_at: "2025-05-28 23:32:09"
    }
  },
  {
    id: "1836192630",
    name: "مطور شخصى",
    avatar: "https://salla-dev.s3.eu-central-1.amazonaws.com/uploads/me3vW9UZWCQ2A4uFhiiwPv0CLSiT907S1br9FuQQ.png",
    website_token: "kkC3iEMaC9LzAbLPs7x3T2a4",
    status: "open",
    last_message: {
      content: "sdfsdfsd",
      created_at: "2025-05-28 19:37:49"
    }
  },
]

// Mock API request function
const mockRequest = async <T = unknown>(url: string, params: RequestParams): Promise<RequestResponse<T>> => {
  console.log('Mock API request:', url, params)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  if (url.includes('/chat/conversations')) {
    return {
      data: { data: mockConversations } as unknown as T,
      status: 200
    }
  }

  return {
    error: 'Not implemented',
    status: 501
  }
}

// Sample chat widgets for demonstration
const chatWidgets: IChat[] = [
]

// Component to display conversations list
const ConversationsList = () => {
  const { conversations, selectConversation, enabled, loading, error } = useSallaChat()

  if (!enabled) {
    return <p>Chat is currently disabled</p>
  }

  return (
    <div className="conversations-list">
      <h2>Conversations</h2>

      {loading && <div className="loading">Loading conversations...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && conversations.length === 0 && (
        <div className="empty">No conversations found</div>
      )}

      <div className="conversations">
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            className="conversation-card"
            onClick={() => selectConversation(conversation)}
          >
            {conversation.avatar && (
              <div className="avatar">
                <img src={conversation.avatar} alt={conversation.name} />
              </div>
            )}
            <div className="details">
              <h3>{conversation.name}</h3>
              {conversation.last_message && (
                <p className="last-message">{conversation.last_message.content}</p>
              )}
              {conversation.last_message && conversation.last_message.created_at && (
                <p className="time">{new Date(conversation.last_message.created_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Component to display chat widget buttons
const ChatWidgetSelector = () => {
  const { openChat, enabled } = useSallaChat()

  if (!enabled) {
    return <p>Chat is currently disabled</p>
  }

  return (
    <div className="chat-widget-selector">
      <h2>Available Chat Widgets</h2>
      <div className="chat-widgets">
        {chatWidgets.map(chat => (
          <div key={chat.id} className="chat-widget-card">
            <h3>{chat.name}</h3>
            <p>{chat.description}</p>
            <button onClick={() => openChat(chat)}>
              Open Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [chatEnabled, setChatEnabled] = useState(true)

  return (
    <SallaChatProvider config={{
      enabled: chatEnabled,
      request: mockRequest,
      apiBaseUrl: 'https://experts-1ba1d9cc10862d2257530d1f4e8d49b5.salla.group/experts/v1'
    }}>
      <div className="app-container">
        <h1>Chatwoot Widget Demo</h1>
        <p>Click on any chat widget below to open it</p>

        <div className="controls">
          <button
            onClick={() => setChatEnabled(!chatEnabled)}
            className={chatEnabled ? 'enabled' : 'disabled'}
          >
            {chatEnabled ? 'Disable Chat' : 'Enable Chat'}
          </button>
        </div>

        <div className="content-container">

          <div className="right-panel">
            <ChatWidgetSelector />
          </div>
        </div>
      </div>
    </SallaChatProvider>
  )
}

export default App
