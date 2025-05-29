import React, { useEffect, useState } from "react";
import { useSallaChat } from "../salla-chat/SallaChat.provider";
import "./ChatDrawer.css";

// Utility function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

// Add type declaration for window.salla
declare global {
  interface Window {
    salla?: {
      storage?: {
        get: (key: string) => unknown;
      };
    };
  }
}

interface ChatDrawerProps {
  enabled: boolean;
}

const ChatDrawerComponent: React.FC<ChatDrawerProps> = ({ enabled }) => {
  const {
    closeChat,
    conversations,
    fetchConversations,
    loading,
    error,
    selectConversation,
    selectedConversation
  } = useSallaChat();

  // Check if dark mode is enabled from window.salla.storage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if window.salla exists and get the dark mode setting
    if (window.salla?.storage?.get) {
      const darkModeSetting = window.salla.storage.get("isDark");
      setIsDarkMode(!!darkModeSetting);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchConversations();
    }
  }, [enabled, fetchConversations]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`chat-drawer ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="chat-drawer-header">
        <h2>Conversations</h2>
        <button className="chat-drawer-close" onClick={closeChat}>
          ✕
        </button>
      </div>

      {loading && <div className="chat-drawer-loading">Loading conversations...</div>}

      {error && <div className="chat-drawer-error">Error: {error}</div>}

      {!loading && !error && conversations.length === 0 && (
        <div className="chat-drawer-empty">No conversations found</div>
      )}

      <div className="chat-drawer-conversations">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
            onClick={() => selectConversation(conversation)}
          >
            <div className="conversation-details">
              {conversation.last_message && conversation.last_message.created_at && (
                <div className="conversation-time">{formatRelativeTime(conversation.last_message.created_at)}</div>
              )}
              <div className="conversation-name">{conversation.name}</div>
              {conversation.last_message && (
                <div className="conversation-last-message">{conversation.last_message.content}</div>
              )}
              {conversation.unread_count && conversation.unread_count > 0 && (
                <div className="conversation-unread">{conversation.unread_count}</div>
              )}
            </div>
            {conversation.avatar && (
              <div className="conversation-avatar">
                <img src={conversation.avatar} alt={conversation.name} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-content">
        {/* This area will be populated by the Chatwoot SDK when a conversation is selected */}
      </div>
    </div>
  );
};

export default ChatDrawerComponent;
