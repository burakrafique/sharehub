import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as messageService from '../services/messageService';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.userId);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await messageService.getConversation(otherUserId);
      setMessages(response.data.messages || []);
      
      // Mark as read
      const unreadIds = response.data.messages
        .filter(m => m.receiver_id === user.id && !m.is_read)
        .map(m => m.id);
      
      if (unreadIds.length > 0) {
        await messageService.markAsRead(unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      await messageService.sendMessage({
        receiver_id: activeConversation.userId,
        item_id: activeConversation.itemId,
        message_text: newMessage
      });
      
      setNewMessage('');
      fetchMessages(activeConversation.userId);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messages-page">
      <div className="container-fluid p-0">
        <div className="row g-0" style={{ height: 'calc(100vh - 60px)' }}>
          {/* Conversations List */}
          <div className="col-md-4 border-end">
            <div className="conversations-header p-3 border-bottom">
              <h4 className="mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                Messages
              </h4>
            </div>
            
            <div className="conversations-list">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border"></div>
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv.userId}
                    className={`conversation-item ${activeConversation?.userId === conv.userId ? 'active' : ''}`}
                    onClick={() => setActiveConversation(conv)}
                  >
                    <div className="d-flex align-items-center p-3">
                      <div className="avatar-circle bg-primary text-white me-3">
                        {conv.otherUserName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-0">{conv.otherUserName}</h6>
                          <small className="text-muted">{formatTime(conv.lastMessageTime)}</small>
                        </div>
                        <p className="text-muted mb-0 text-truncate small">
                          {conv.lastMessage}
                        </p>
                        {conv.itemTitle && (
                          <small className="text-muted">
                            <i className="bi bi-box me-1"></i>
                            {conv.itemTitle}
                          </small>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="badge bg-primary rounded-pill">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-5">
                  <i className="bi bi-chat-dots text-muted fs-1 d-block mb-3"></i>
                  <p className="text-muted">No messages yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-md-8">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="chat-header p-3 border-bottom bg-light">
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-primary text-white me-3">
                      {activeConversation.otherUserName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0">{activeConversation.otherUserName}</h5>
                      {activeConversation.itemTitle && (
                        <small className="text-muted">About: {activeConversation.itemTitle}</small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="messages-area p-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{msg.message_text}</div>
                      <div className="message-time">
                        {formatTime(msg.created_at)}
                        {msg.sender_id === user.id && (
                          <i className={`bi bi-check${msg.is_read ? '-all' : ''} ms-1`}></i>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="message-input-area p-3 border-top bg-light">
                  <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-send"></i>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center">
                  <i className="bi bi-chat-dots text-muted" style={{ fontSize: '5rem' }}></i>
                  <h4 className="text-muted mt-3">Select a conversation to start messaging</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
