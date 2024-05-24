const express = require('express');
const Task = require('../models/Task');
const validateTask = require('../middleware/validateTask');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Create a new task with authentication and validation
router.post('/', authenticate, validateTask, async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user.userId });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update a task with authentication and validation
router.patch('/:id', authenticate, validateTask, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Other routes...

module.exports = router;
