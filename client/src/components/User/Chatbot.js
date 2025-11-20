import React, { useState, useEffect, useRef } from 'react';

const API_URL = 'http://localhost:5000/api';

const Chatbot = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chatbot/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chatbot/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setInputMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      faq: 'What are the community guidelines?',
      booking: 'How do I book an amenity?',
      complaint: 'What is the status of my complaints?',
      emergency: 'What should I do in an emergency?'
    };
    sendMessage(quickMessages[action]);
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear chat history?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chatbot/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>🤖 Community Assistant</h2>
        <button onClick={clearHistory} className="btn-secondary" style={{ padding: '5px 10px' }}>
          Clear History
        </button>
      </div>

      <div className="quick-actions">
        <button onClick={() => handleQuickAction('faq')} className="quick-action-btn">
          📋 Guidelines
        </button>
        <button onClick={() => handleQuickAction('booking')} className="quick-action-btn">
          📅 Booking Help
        </button>
        <button onClick={() => handleQuickAction('complaint')} className="quick-action-btn">
          🔧 Complaint Status
        </button>
        <button onClick={() => handleQuickAction('emergency')} className="quick-action-btn">
          🚨 Emergency
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>👋 Welcome to Community Assistant!</h3>
            <p>I can help you with:</p>
            <ul>
              <li>Amenity booking assistance</li>
              <li>Complaint status tracking</li>
              <li>Community guidelines</li>
              <li>Emergency procedures</li>
              <li>General FAQs</li>
            </ul>
            <p>Try clicking a quick action button or type your question below!</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className="chat-exchange">
            <div className="user-message">
              <div className="message-content">
                <strong>You:</strong> {msg.message}
              </div>
              <div className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
            <div className="bot-message">
              <div className="message-content">
                <div style={{ whiteSpace: 'pre-line' }}>{msg.response}</div>
              </div>
              <div className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="bot-message">
            <div className="message-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !inputMessage.trim()} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
