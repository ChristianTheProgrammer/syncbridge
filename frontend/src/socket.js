// Initialize WebSocket connection
const socket = new WebSocket('ws://localhost:5000/ws');

// When the connection is open
socket.onopen = () => {
    console.log('WebSocket connection established');
};

// When a message is received
socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
};

// When there is an error
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// When the connection is closed
socket.onclose = () => {
    console.log('WebSocket connection closed');
};

export default socket;
