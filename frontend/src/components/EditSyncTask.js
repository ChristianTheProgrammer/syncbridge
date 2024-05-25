import React, { useState } from 'react';

const EditSyncTask = ({ task, onUpdateTask, onCancel }) => {
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [priority, setPriority] = useState(task.priority || 'Medium');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName) {
            setError('Task name is required');
            return;
        }

        const updatedTask = { ...task, name: taskName, status, dueDate, priority };
        await onUpdateTask(updatedTask);
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
            <button type="submit" className="btn btn-primary">Update Task</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EditSyncTask;
