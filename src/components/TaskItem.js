import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import  '../styles/modal.css';

const TaskItem = ({ task, deleteTask, updateTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleTaskItemClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      assignedTo: selectedUser,
      status: 'inProcess',
    };

    updateTask(updatedTask);
    setShowModal(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="task-item"
      onClick={handleTaskItemClick}
    >
      <h3>
        <Link to={`/tasks/${task.title}`}>{task.title}</Link>
      </h3>
      <p><strong>Project:</strong> <strong>{task.project}</strong></p>
      <p><strong>Assigned To:</strong> <strong>{assignedTo}</strong></p>
      <p><strong>Completion Date:</strong> <strong>{task.completionDate}</strong></p>
      <div>
      {task.priority === 'red' && (
        <button style={{ backgroundColor: 'red' }}></button>
      )}
      {task.priority === 'yellow' && (
        <button  style={{ backgroundColor: 'yellow' }}></button>
      )}
      {task.priority === 'blue' && (
        <button style={{ backgroundColor: 'blue' }}></button>
      )} 
      </div>
      <div >
        <button className="delete-task-button" onClick={() => deleteTask(task.id)}>x</button>
      </div>
      {showModal && (
        <div className="modal">
          <form onSubmit={handleModalSubmit}>
            <label htmlFor="assignedTo">Assigned To:</label>
            <select
              id="assignedTo"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Assign To:</option>
              <option value="User1">User1</option>
              <option value="User2">User2</option>
              <option value="User3">User3</option>
            </select>
            <button type="submit">Assign Task</button>
          </form>
        </div>
      )}
</div>

  );
};

export default TaskItem;
