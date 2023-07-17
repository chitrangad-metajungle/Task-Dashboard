import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/modal.css";
import "../styles/task.css";
import "../styles/task2.scss";

const TaskItem = ({ task, deleteTask, updateTask, usersArr }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);
  const [users, setUsers] = useState(usersArr);

  useEffect(() => {
    setUsers(usersArr);
  }, [usersArr]);

  useEffect(() => {
    setAssignedTo(task.assignedTo);
  }, [task.assignedTo]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleTaskItemClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      assignedTo: selectedUser,
      status: "inProcess",
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
      <h3 className = "task__tags"><span class='task__tag task__tag--illustration'>
      Project:{task.project}</span>
      </h3>
      <br></br>
      <p>
        <strong><Link to={`/tasks/${task.title}`}>{task.title}</Link></strong>
      </p>
      <br></br>
      {/* <p>
        <strong>Project:{task.project}</strong>
      </p> */}
      <br></br>
      <p>
        <strong>Assigned To:</strong> <strong>{assignedTo}</strong>
      </p>
      <br></br>
      <p>
        <strong>Completion Date:</strong> <strong>{task.completionDate}</strong>
      </p>
      <br></br>
      <div>
        {task.priority === "red" && (
          <button style={{ backgroundColor: "red" }}></button>
        )}
        {task.priority === "yellow" && (
          <button style={{ backgroundColor: "yellow" }}></button>
        )}
        {task.priority === "blue" && (
          <button style={{ backgroundColor: "blue" }}></button>
        )}
      </div>
      <div>
        <button
          className="delete-task-button"
          onClick={() => deleteTask(task.id)}
        >
          x
        </button>
      </div>
      {showModal && (
        <div
          style={{
            // backgroundColor: "red",
            position: "absolute",
            top: "50%",
            width: "50vw",
          }}
        >
          <form onSubmit={handleModalSubmit}>
            <label htmlFor="assignedTo">Assigned To:</label>
            <select
              id="assignedTo"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Assign To:</option>
              {users.map((user) => {
                return (
                  <option value={user} key={user}>
                    {user}
                  </option>
                );
              })}
            </select>
            <button type="submit">Assign Task</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
