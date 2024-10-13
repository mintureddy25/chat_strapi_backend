'use strict';

const sessions = {};

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Initialize WebSocket on server startup
    strapi.io.on('connection', (socket) => {
      console.log('A user connected');

      // Listen for session join requests
      socket.on('joinSession', (sessionId) => {
        // Store the socket ID by session
        if (!sessions[sessionId]) {
          sessions[sessionId] = [];
        }
        sessions[sessionId].push(socket.id);
        socket.join(sessionId);
        console.log(`Socket ${socket.id} joined session ${sessionId}`);
      });

      // Listen for incoming messages
      socket.on('message', ({ sessionId, content }) => {
        console.log('Received message:', content);

        // Emit the message to the specific session
        if (sessions[sessionId]) {
          strapi.io.to(sessionId).emit('message', { content, sessionId });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');

        // Remove socket from sessions on disconnect
        for (const sessionId in sessions) {
          sessions[sessionId] = sessions[sessionId].filter(id => id !== socket.id);
          if (sessions[sessionId].length === 0) {
            delete sessions[sessionId]; // Clean up empty sessions
          }
        }
      });
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
