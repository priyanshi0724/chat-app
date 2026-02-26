import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import './Chat.css';

// Connect to the WebSocket server
const SOCKET_URL = 'http://localhost:3001';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [users, setUsers] = useState([]);

  // Generate random username
  const generateUsername = () => {
    const adjectives = ['Happy', 'Cool', 'Swift', 'Bright', 'Clever', 'Brave'];
    const nouns = ['Panda', 'Eagle', 'Tiger', 'Dolphin', 'Fox', 'Wolf'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('messageHistory', (history) => {
      setMessages(history);
    });

    newSocket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('userList', (userList) => {
      setUsers(userList);
    });

    newSocket.on('userTyping', (user) => {
      setTypingUser(user);
      setIsTyping(true);
    });

    newSocket.on('userStoppedTyping', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleJoin = useCallback(() => {
    if (username.trim()) {
      socket?.emit('join', username);
      setIsJoined(true);
    }
  }, [username, socket]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('sendMessage', {
        text: newMessage,
        username: username
      });
      socket.emit('stopTyping');
      setNewMessage('');
      setIsTyping(false);
    }
  }, [newMessage, username, socket]);

  const handleTyping = useCallback((e) => {
    setNewMessage(e.target.value);
    
    if (socket) {
      if (!isTyping) {
        socket.emit('typing', username);
        setIsTyping(true);
      }
      
      // Stop typing after 1 second of no input
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit('stopTyping');
        setIsTyping(false);
      }, 1000);
    }
  }, [socket, username, isTyping]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleGenerateUsername = () => {
    setUsername(generateUsername());
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="chat-container">
        <div className="join-screen">
          <h1 className="app-title">💬 Real-Time Chat</h1>
          <div className="join-form">
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                className="username-input"
              />
              <button onClick={handleGenerateUsername} className="generate-btn">
                Generate
              </button>
            </div>
            <button 
              onClick={handleJoin} 
              disabled={!username.trim() || !isConnected}
              className="join-btn"
            >
              {isConnected ? 'Join Chat' : 'Connecting...'}
            </button>
            {!isConnected && (
              <p className="connection-status">Connecting to server...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-info">
          <h2>💬 Chat Room</h2>
          <span className="connection-indicator">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="user-info">
          <span>Welcome, <strong>{username}</strong></span>
          <span className="user-count">👥 {users.length} online</span>
        </div>
      </div>

      <MessageList messages={messages} currentUser={username} />

      {isTyping && typingUser && typingUser !== username && (
        <div className="typing-indicator">
          {typingUser} is typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="send-btn"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
