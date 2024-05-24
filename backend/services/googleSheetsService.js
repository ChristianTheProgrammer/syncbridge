const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const Task = require('../models/Task');

const credentials = JSON.parse(fs.readFileSync('C:/Users/Christian/syncbridge/backend/credentials.json'));

const oAuth2Client = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

// Sync tasks from Google Sheets to MongoDB
const syncTasksFromSheet = async (spreadsheetId, range) => {
    const sheetData = await getSheetData(spreadsheetId, range);
    for (const row of sheetData) {
        const [title, description, status, dueDate] = row;
        await Task.findOneAndUpdate(
            { title },
            { title, description, status, dueDate: new Date(dueDate) },
            { upsert: true }
        );
    }
};

// Sync tasks from MongoDB to Google Sheets
const syncTasksToSheet = async (spreadsheetId, range) => {
    const tasks = await Task.find();
    const values = tasks.map(task => [
        task.title,
        task.description,
        task.status,
        task.dueDate.toISOString().split('T')[0]
    ]);
    await updateSheetData(spreadsheetId, range, values);
};

// Generate an authentication URL for the user to grant access
const getAuthUrl = () => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return authUrl;
};

// Set the OAuth2 client credentials
const setCredentials = (tokens) => {
    oAuth2Client.setCredentials(tokens);
};

// Function to get Google Sheets data
const getSheetData = async (spreadsheetId, range) => {
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    return response.data.values;
};

// Function to update Google Sheets data
const updateSheetData = async (spreadsheetId, range, values) => {
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const resource = { values };
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource,
    });
    return response.data;
};

module.exports = {
    oAuth2Client,
    getAuthUrl,
    setCredentials,
    getSheetData,
    updateSheetData,
    syncTasksFromSheet,
    syncTasksToSheet
};
