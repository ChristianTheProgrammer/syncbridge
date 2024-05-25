const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const syncTasks = require('./routes/syncTasks');
const auth = require('./routes/auth'); // Import the auth route

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/sync-tasks', syncTasks);
app.use('/auth', auth); // Use the auth route

const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost:27017/syncbridge', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));
