require('dotenv').config(); // Add this line to use environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const { exec } = require('child_process');
const syncTasks = require('./routes/syncTasks');
const auth = require('./routes/auth');
const logs = require('./routes/logs');
const http = require('http');
const helmet = require('helmet'); // Add helmet for security
const { initializeSocket } = require('./emitTaskUpdate'); // Import initializeSocket
const errorHandler = require('./middleware/errorHandler'); // Ensure you have an error handling middleware
const logger = require('./logger'); // Import logger

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Route setup
app.use('/api/sync-tasks', syncTasks);
app.use('/api/auth', auth);
app.use('/api/logs', logs);

// Initialize Socket.io
initializeSocket(server);

// Error handling middleware
app.use(errorHandler);

// Schedule a task to run every day at 8 AM
cron.schedule('0 8 * * *', () => {
    exec('node notifications.js', (error, stdout, stderr) => {
        if (error) {
            logger.error(`Error executing notifications script: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.error(`Error output from notifications script: ${stderr}`);
            return;
        }
        logger.info(`Notifications script output: ${stdout}`);
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/syncbridge';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => logger.error('Failed to connect to MongoDB', err));
