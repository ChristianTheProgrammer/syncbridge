import React, { useState, useEffect } from 'react';
import CreateSyncTask from './CreateSyncTask';
import EditSyncTask from './EditSyncTask';
import axios from 'axios';

const Dashboard = () => {
    const [syncTasks, setSyncTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sync-tasks');
                setSyncTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
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
        try {
            await axios.delete(`http://localhost:5000/api/sync-tasks/${taskId}`);
            setSyncTasks(syncTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/sync-tasks/${taskId}/complete`);
            setSyncTasks(syncTasks.map(task => task._id === taskId ? response.data : task));
        } catch (error) {
            console.error('Error marking task as completed:', error);
        }
    };

    const filteredTasks = syncTasks.filter(task => {
        if (filter === 'All') return true;
        return task.status === filter;
    });

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <CreateSyncTask onTaskCreated={handleTaskCreated} />
            {editingTask && (
                <EditSyncTask
                    task={editingTask}
                    onUpdateTask={handleUpdateTask}
                    onCancel={() => setEditingTask(null)}
                />
            )}
            <div className="my-3">
                <label>Filter tasks:</label>
                <select
                    className="form-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3>Sync Tasks</h3>
                    <ul className="list-group">
                        {filteredTasks.map(task => (
                            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{task.name}</strong> - {task.status} - {task.priority} Priority
                                    {task.completed && <span className="badge bg-success ms-2">Completed</span>}
                                </div>
                                <div>
                                    {!task.completed && (
                                        <button className="btn btn-sm btn-success me-2" onClick={() => handleCompleteTask(task._id)}>Complete</button>
                                    )}
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditTask(task)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
