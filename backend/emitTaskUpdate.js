// backend/emitTaskUpdate.js
const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = new Server(server);
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

const emitTaskUpdate = () => {
    if (io) {
        io.emit('taskUpdate', { message: 'Task updated' });
    }
};

module.exports = { initializeSocket, emitTaskUpdate };
