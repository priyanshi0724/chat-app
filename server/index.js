const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configure Socket.io with CORS to allow client connections
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store message history in memory
let messageHistory = [];

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send message history to newly connected user
  socket.emit('messageHistory', messageHistory);

  // Handle user joining
  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    
    // Broadcast join message
    const joinMessage = {
      id: Date.now(),
      text: `${username} has joined the chat`,
      type: 'system',
      timestamp: new Date().toISOString()
    };
    messageHistory.push(joinMessage);
    io.emit('newMessage', joinMessage);
  });

  // Handle new messages
  socket.on('sendMessage', (messageData) => {
    const message = {
      id: Date.now(),
      text: messageData.text,
      username: messageData.username,
      type: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add to history
    messageHistory.push(message);
    
    // Keep only last 100 messages
    if (messageHistory.length > 100) {
      messageHistory = messageHistory.slice(-100);
    }
    
    // Broadcast message to all clients
    io.emit('newMessage', message);
  });

  // Handle typing indicator
  socket.on('typing', (username) => {
    socket.broadcast.emit('userTyping', username);
  });

  // Handle stopping typing
  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStoppedTyping');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
    
    if (username) {
      const leaveMessage = {
        id: Date.now(),
        text: `${username} has left the chat`,
        type: 'system',
        timestamp: new Date().toISOString()
      };
      messageHistory.push(leaveMessage);
      io.emit('newMessage', leaveMessage);
    }
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
