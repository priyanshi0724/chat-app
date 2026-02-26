import React from 'react';
import './Message.css';

const Message = ({ message, isOwnMessage, currentUser }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'system') {
    return (
      <div className="message system-message">
        <span className="message-text">{message.text}</span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    );
  }

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-content">
        {!isOwnMessage && (
          <span className="message-username">{message.username}</span>
        )}
        <div className="message-bubble">
          <span className="message-text">{message.text}</span>
        </div>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default Message;
