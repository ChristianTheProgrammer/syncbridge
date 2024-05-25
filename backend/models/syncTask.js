const mongoose = require('mongoose');

const syncTaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: false
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    }
});

const SyncTask = mongoose.model('SyncTask', syncTaskSchema);

module.exports = { SyncTask };
