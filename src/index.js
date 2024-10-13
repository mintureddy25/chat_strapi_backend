'use strict';

const { Server } = require('socket.io');

module.exports = {
  async register({ strapi }) {
    
  },

  async bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
      },
    });

    const userSessions = {}; 

    
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Join a session and associate with user ID
      socket.on('joinSession', ({ sessionId, userId }) => {
        socket.join(sessionId);
       
        userSessions[socket.id] = { sessionId, userId };
        console.log(`User ${userId} joined session: ${sessionId}`);
      });

      
      socket.on('message', ({ sessionId, content, recipientId }) => {
        console.log('Message received:', content);

       
        const messageData = {
          content,
          timestamp: new Date().toISOString(),
          senderId: userSessions[socket.id].userId,
          id: Date.now(),
          server: true
        };

        
        const recipientSocketId = Object.keys(userSessions).find(
          (id) => userSessions[id].userId === recipientId && userSessions[id].sessionId === sessionId
        );

        if (recipientSocketId) {
         
          io.to(recipientSocketId).emit('message', messageData);
        } else {
          console.log(`User ${recipientId} not found in session ${sessionId}`);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSessions[socket.id]; 
      });
    });
  },
};
