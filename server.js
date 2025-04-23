const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });
  
  socket.on('draw', (data) => {
    socket.to(data.page).emit('draw', data);
  });
  
  socket.on('shape', (data) => {
    socket.to(data.page).emit('shape', data);
  });
  
  socket.on('shapeUpdate', (data) => {
    socket.to(data.page).emit('shapeUpdate', data);
  });
  
  socket.on('clearCanvas', (data) => {
    socket.to(data.page).emit('clearCanvas', data);
  });
  
  socket.on('pageChanged', (data) => {
    socket.to(data.page).emit('pageChanged', data);
  });
  
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});