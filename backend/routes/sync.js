const express = require('express');
const { syncTasksFromSheet, syncTasksToSheet } = require('../services/googleSheetsService');
const router = express.Router();

// Route to sync tasks from Google Sheets to MongoDB
router.post('/sync-from-sheet', async (req, res) => {
    const { spreadsheetId, range } = req.body;
    try {
        await syncTasksFromSheet(spreadsheetId, range);
        res.send('Tasks synchronized from Google Sheets to MongoDB.');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to sync tasks from MongoDB to Google Sheets
router.post('/sync-to-sheet', async (req, res) => {
    const { spreadsheetId, range } = req.body;
    try {
        await syncTasksToSheet(spreadsheetId, range);
        res.send('Tasks synchronized from MongoDB to Google Sheets.');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
