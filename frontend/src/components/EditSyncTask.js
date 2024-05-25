import React, { useState } from 'react';

const EditSyncTask = ({ task, onUpdateTask, onCancel }) => {
    const [taskName, setTaskName] = useState(task.name);
    const [status, setStatus] = useState(task.status);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTask = { ...task, name: taskName, status };
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
            <button type="submit">Update Task</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EditSyncTask;
