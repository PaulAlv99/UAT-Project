const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const passport = require('./middleware/passport');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.set('socketio', io);

let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join', (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    console.log(`User ${userId} joined. Socket: ${socket.id}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message, timestamp }) => {
    if (!senderId || !receiverId || !message) return;

    const msgObject = { senderId, receiverId, message, timestamp };

    try {
      await Message.create(msgObject); // Save to DB
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', msgObject);
    }

    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit('receiveMessage', msgObject);
    }

    console.log(`${senderId} -> ${receiverId}: "${message}"`);
  });

  socket.on('disconnect', () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Start servers after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  const SOCKET_PORT = 3001;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP API running on port ${PORT}`);
  });

  server.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
  });
});
