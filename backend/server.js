const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const { Server } = require('ws'); // Import ws

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/syncbridge', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const syncRoutes = require('./routes/sync');
const trelloRoutes = require('./routes/trello');

app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);  // Add auth routes
app.use('/api/sync', syncRoutes);
app.use('/api/trello', trelloRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('SyncBridge API');
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Set up WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
