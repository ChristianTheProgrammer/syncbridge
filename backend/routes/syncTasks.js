const express = require('express');
const router = express.Router();
const { SyncTask } = require('../models/syncTask');
const { emitTaskUpdate } = require('../emitTaskUpdate'); // Import emitTaskUpdate

// Get all sync tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await SyncTask.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Create a new sync task
router.post('/', async (req, res) => {
    const { name, status, dueDate, priority } = req.body;
    try {
        const newTask = new SyncTask({ name, status, dueDate, priority });
        await newTask.save();
        emitTaskUpdate(); // Emit task update event
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Update a sync task
router.put('/:id', async (req, res) => {
    const { name, status, dueDate, priority } = req.body;
    try {
        const task = await SyncTask.findByIdAndUpdate(
            req.params.id,
            { name, status, dueDate, priority },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        emitTaskUpdate(); // Emit task update event
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Mark task as completed
router.put('/:id/complete', async (req, res) => {
    try {
        const task = await SyncTask.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        emitTaskUpdate(); // Emit task update event
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error marking task as completed', error });
    }
});

// Delete a sync task
router.delete('/:id', async (req, res) => {
    try {
        const task = await SyncTask.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        emitTaskUpdate(); // Emit task update event
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error); // Add this line
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

module.exports = router;
