import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import CreateSyncTask from './CreateSyncTask';
import EditSyncTask from './EditSyncTask';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskDetailModal from './TaskDetailModal';
import socket from '../socket'; // Ensure correct import

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const [syncTasks, setSyncTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);

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

        socket.on('taskUpdate', fetchTasks); // Listen for task updates

        return () => {
            socket.off('taskUpdate', fetchTasks);
        };
    }, []);

    const handleTaskCreated = async (newTask) => {
        try {
            const response = await axios.post('http://localhost:5000/api/sync-tasks', newTask);
            setSyncTasks([...syncTasks, response.data]);
        } catch (error) {
            console.error('Error creating task:', error);
        }
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
        if (filter === 'Active') return !task.completed;
        if (filter === 'Inactive') return task.completed;
        return false;
    });

    const totalTasks = syncTasks.length;
    const completedTasks = syncTasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const chartData = {
        labels: ['Completed Tasks', 'Pending Tasks'],
        datasets: [
            {
                label: 'Tasks',
                data: [completedTasks, pendingTasks],
                backgroundColor: ['#4caf50', '#f44336'],
            },
        ],
    };

    return (
        <div className="container mt-4">
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
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="mt-4">Sync Tasks</h3>
                    <div className="card mb-4">
                        <div className="card-header">Task Statistics</div>
                        <div className="card-body">
                            <p>Total Tasks: {totalTasks}</p>
                            <p>Completed Tasks: {completedTasks}</p>
                            <p>Pending Tasks: {pendingTasks}</p>
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header">Task Completion Chart</div>
                        <div className="card-body">
                            <Bar data={chartData} />
                        </div>
                    </div>
                    <ul className="list-group mb-4">
                        {filteredTasks.map(task => (
                            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer' }}>
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
            <div className="card">
                <div className="card-header">
                    Sync Summary
                </div>
                <div className="card-body">
                    <h5 className="card-title">Total Tasks: {syncTasks.length}</h5>
                    <p className="card-text">Active: {syncTasks.filter(task => !task.completed).length}</p>
                    <p className="card-text">Completed: {syncTasks.filter(task => task.completed).length}</p>
                </div>
            </div>
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
