import React, { useState, useEffect } from 'react';
import CreateSyncTask from './CreateSyncTask';
import EditSyncTask from './EditSyncTask';
import axios from 'axios';

const Dashboard = () => {
    const [syncTasks, setSyncTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            // Replace with your backend API endpoint
            const response = await axios.get('http://localhost:5000/api/sync-tasks');
            setSyncTasks(response.data);
            setLoading(false);
        };

        fetchTasks();
    }, []);

    const handleTaskCreated = (newTask) => {
        setSyncTasks([...syncTasks, newTask]);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleUpdateTask = async (updatedTask) => {
        const response = await axios.put(`http://localhost:5000/api/sync-tasks/${updatedTask._id}`, updatedTask);
        setSyncTasks(syncTasks.map(task => task._id === updatedTask._id ? response.data : task));
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId) => {
        await axios.delete(`http://localhost:5000/api/sync-tasks/${taskId}`);
        setSyncTasks(syncTasks.filter(task => task._id !== taskId));
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <CreateSyncTask onTaskCreated={handleTaskCreated} />
            {editingTask && (
                <EditSyncTask
                    task={editingTask}
                    onUpdateTask={handleUpdateTask}
                    onCancel={() => setEditingTask(null)}
                />
            )}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h2>Sync Tasks</h2>
                    <ul>
                        {syncTasks.map(task => (
                            <li key={task._id}>
                                {task.name} - {task.status}
                                <button onClick={() => handleEditTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
