
const mongoose = require('mongoose');

const syncTaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const SyncTask = mongoose.model('SyncTask', syncTaskSchema);

module.exports = { SyncTask };
