
const express = require('express');
const router = express.Router();
const { SyncTask } = require('../models/syncTask');

// Create a new sync task
router.post('/', async (req, res) => {
    const { name, status } = req.body;
    const newTask = new SyncTask({ name, status });
    await newTask.save();
    res.status(201).json(newTask);
});

// Retrieve all sync tasks
router.get('/', async (req, res) => {
    const tasks = await SyncTask.find();
    res.status(200).json(tasks);
});

// Update a sync task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;
    const updatedTask = await SyncTask.findByIdAndUpdate(id, { name, status }, { new: true });
    res.status(200).json(updatedTask);
});

// Delete a sync task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await SyncTask.findByIdAndDelete(id);
    res.status(204).send();
});

module.exports = router;
