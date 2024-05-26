// backend/routes/logs.js
const express = require('express');
const router = express.Router();

// Mock logs data
const logs = [
    { _id: '1', message: 'Sync task created', timestamp: new Date().toISOString() },
    { _id: '2', message: 'Sync task completed', timestamp: new Date().toISOString() },
    // Add more mock logs as needed
];

// GET /api/logs
router.get('/', (req, res) => {
    res.json(logs);
});

module.exports = router;
