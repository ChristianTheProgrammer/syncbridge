import React, { useState } from 'react';
import axios from 'axios';

const CreateSyncTask = ({ onTaskCreated }) => {
    const [taskName, setTaskName] = useState('');
    const [status, setStatus] = useState('Active');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName) {
            setError('Task name is required');
            return;
        }

        const newTask = { name: taskName, status, dueDate, priority };

        try {
            const response = await axios.post('http://localhost:5000/api/sync-tasks', newTask);
            if (response.status === 201) {
                onTaskCreated(response.data);
                setTaskName('');
                setStatus('Active');
                setDueDate('');
                setPriority('Medium');
                setError('');
            } else {
                setError('Failed to create task');
            }
        } catch (error) {
            setError('Failed to create task: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Task Name:</label>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div>
                <label>Due Date:</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div>
                <label>Priority:</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="btn btn-primary">Create Task</button>
        </form>
    );
};

export default CreateSyncTask;
