const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Simple health check route
app.get('/', (req, res) => {
  res.send('Socket.io server is running');
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
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
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
