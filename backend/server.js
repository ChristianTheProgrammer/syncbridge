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
const { initializeSocket } = require('./emitTaskUpdate'); // Import initializeSocket

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use('/api/sync-tasks', syncTasks);
app.use('/api/auth', auth);
app.use('/api/logs', logs);

initializeSocket(server); // Initialize Socket.io

// Schedule a task to run every day at 8 AM
cron.schedule('0 8 * * *', () => {
    exec('node notifications.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing notifications script: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output from notifications script: ${stderr}`);
            return;
        }
        console.log(`Notifications script output: ${stdout}`);
    });
});

const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost:27017/syncbridge', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));
