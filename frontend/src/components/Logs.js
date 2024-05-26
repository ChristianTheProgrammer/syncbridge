// src/components/Logs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/logs');
                setLogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <h3 className="mt-4">Logs</h3>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <ul className="list-group mb-4">
                    {logs.map(log => (
                        <li key={log._id} className="list-group-item">
                            <strong>{log.message}</strong> - {new Date(log.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Logs;
