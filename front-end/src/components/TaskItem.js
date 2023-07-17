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
  const [initialName, setInitialName] = useState("");

  const getInitials = (name) => {
    const names = name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n[0];
    });
    return initials;
  };

  useEffect(() => {
    setInitialName(getInitials(assignedTo));
  }, [assignedTo]);

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
      <div>
        <span>
          <h3 className="task__tags">
            <span class="task__tag task__tag--illustration">
              {task.project}
            </span>
          </h3>
        </span>
        <span class="task__owner">
          {initialName !== "undefined" ? initialName.toUpperCase() : "NA"}
        </span>
      </div>

      <br></br>
      <p>
        <Link to={`/tasks/${task.title}`}>{task.title}</Link>
      </p>
      <br></br>
      {/* <p>
        <strong>Project:{task.project}</strong>
      </p> */}
      <br></br>
      <p>Assigned To:{assignedTo}</p>
      <br></br>
      <p>Completion Date:{task.completionDate}</p>
      <br></br>
      <div>
        {task.priority === "red" && (
          <span
            className="bar"
            style={{ backgroundColor: "blue", width: "100%" }}
          ></span>
        )}
        {task.priority === "yellow" && (
          <span
            className="bar"
            style={{ backgroundColor: "yellow", width: "100%" }}
          ></span>
        )}
        {task.priority === "blue" && (
          <span
            className="bar"
            style={{ backgroundColor: "blue", width: "100%" }}
          ></span>
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
