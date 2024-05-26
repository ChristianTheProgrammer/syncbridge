import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TaskDetailModal = ({ task, onClose }) => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Task Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>{task.name}</h5>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <p>Description: {task.description}</p>
                <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
                <p>Updated At: {new Date(task.updatedAt).toLocaleString()}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskDetailModal;
