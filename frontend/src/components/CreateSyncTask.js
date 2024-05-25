
import React, { useState } from 'react';
import axios from 'axios';

const CreateSyncTask = ({ onTaskCreated }) => {
    const [taskName, setTaskName] = useState('');
    const [status, setStatus] = useState('Active');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { name: taskName, status };
        
        // Replace with your backend API endpoint
        const response = await axios.post('/api/sync-tasks', newTask);
        
        if (response.status === 201) {
            onTaskCreated(response.data);
            setTaskName('');
            setStatus('Active');
        } else {
            console.error('Failed to create task');
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
            <button type="submit">Create Task</button>
        </form>
    );
};

export default CreateSyncTask;
