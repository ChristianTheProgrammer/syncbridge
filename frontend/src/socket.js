import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure this URL matches your backend server

socket.on('connect', () => {
    console.log('Socket.io connection established');
});

socket.on('disconnect', () => {
    console.log('Socket.io connection closed');
});

export default socket;
