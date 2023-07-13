import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    todo: [],
    inProcess: [],
    blockers: [],
    verification: [],
    completed: [],
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [taskCounts, setTaskCounts] = useState({
    todo: 0,
    inProcess: 0,
    blockers: 0,
    verification: 0,
    completed: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryProject, setSearchQueryProject] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchInputChangeProject = (e) => {
    setSearchQueryProject(e.target.value);
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    //localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    try {
      const result = await axios.delete(
        `http://localhost:8000/api/tasks/${taskId}`
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting task");
    }
  };

  async function updateTaskDatabase(updatedTask) {
    try {
      const result = await axios.put(
        `http://localhost:8000/api/tasks/${updatedTask.id}`,
        updatedTask
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error updating task front");
    }
  }

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === updatedTask.id) {
        return updatedTask;
      }
      return t;
    });

    setTasks(updatedTasks);
    //localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    updateTaskDatabase(updatedTask);
  };

  // Fetch tasks from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedTasks = await axios.get("http://localhost:8000/api/tasks");
        setTasks(storedTasks.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    console.log(tasks);
  }, []);

  useEffect(() => {
    const categorizedTasks = {
      todo: [],
      inProcess: [],
      blockers: [],
      verification: [],
      completed: [],
    };

    tasks.forEach((task) => {
      if (task.status === "todo") {
        categorizedTasks.todo.push(task);
      } else if (task.status === "inProcess") {
        categorizedTasks.inProcess.push(task);
      } else if (task.status === "blockers") {
        categorizedTasks.blockers.push(task);
      } else if (task.status === "verification") {
        categorizedTasks.verification.push(task);
      } else if (task.status === "completed") {
        categorizedTasks.completed.push(task);
      }
    });

    // Sort tasks within each column based on priority and completion date
    Object.keys(categorizedTasks).forEach((column) => {
      categorizedTasks[column] = sortTasks(categorizedTasks[column]);
    });

    setColumns(categorizedTasks);
    // Calculate and set the task counts
    const counts = Object.keys(categorizedTasks).reduce((acc, column) => {
      acc[column] = categorizedTasks[column].length;
      return acc;
    }, {});

    setTaskCounts(counts);
  }, [tasks]);

  const sortTasks = (tasks) => {
    tasks.sort((a, b) => {
      const priorityValueA = priorityValue(a.priority);
      const priorityValueB = priorityValue(b.priority);

      if (priorityValueA !== priorityValueB) {
        return priorityValueB - priorityValueA;
      }

      const dateA = new Date(a.completionDate);
      const dateB = new Date(b.completionDate);
      return dateA - dateB;
    });

    return tasks;
  };

  const priorityValue = (priority) => {
    switch (priority) {
      case "red":
        return 3;
      case "yellow":
        return 2;
      case "blue":
        return 1;
      default:
        return 0;
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const task = JSON.parse(e.dataTransfer.getData("text/plain"));
    const updatedTasks = tasks.map((t) => {
      if (t.id === task.id) {
        t.status = status; // update status
        updateTaskDatabase(t); // update in the database
        return t;
      }
      return t;
    });

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const moveTaskToInProgress = (taskToUpdate) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskToUpdate.id) {
        return { ...task, status: "inProcess" };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <div>
      <div>
        <h2>Task List</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search tasks by title..."
          />
          <input
            type="text"
            value={searchQueryProject}
            onChange={handleSearchInputChangeProject}
            placeholder="Search tasks by project..."
          />

          <div className="user-buttons">
            <button
              style={{ marginLeft: "10px" }}
              className={selectedUser === "User1" ? "active" : ""}
              onClick={() => setSelectedUser("User1")}
            >
              User 1
            </button>
            <button
              className={selectedUser === "User2" ? "active" : ""}
              onClick={() => setSelectedUser("User2")}
            >
              User 2
            </button>
            <button
              className={selectedUser === "User3" ? "active" : ""}
              onClick={() => setSelectedUser("User3")}
            >
              User 3
            </button>
            <button
              className={selectedUser === "" ? "active" : ""}
              onClick={() => setSelectedUser("")}
            >
              All
            </button>
          </div>
        </div>
      </div>
      <div className="kanban-board">
        <div
          className="column"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <h3>
            To Do{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#097969",
                fontSize: "14px",
              }}
            >
              {taskCounts.todo}
            </span>
          </h3>
          {columns.todo.map((task) => {
            if (
              (selectedUser === "" || task.assignedTo === selectedUser) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              task.project
                .toLowerCase()
                .includes(searchQueryProject.toLowerCase())
            ) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  moveTaskToInProgress={moveTaskToInProgress}
                />
              );
            }
            return null;
          })}
        </div>
        <div
          className="column"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, "inProcess")}
        >
          <h3>
            In Process{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#097969",
                fontSize: "14px",
              }}
            >
              {taskCounts.inProcess}
            </span>
          </h3>
          {columns.inProcess.map((task) => {
            if (
              (selectedUser === "" || task.assignedTo === selectedUser) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              task.project
                .toLowerCase()
                .includes(searchQueryProject.toLowerCase())
            ) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              );
            }
            return null;
          })}
        </div>
        <div
          className="column"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, "blockers")}
        >
          <h3>
            Blockers{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#097969",
                fontSize: "14px",
              }}
            >
              {taskCounts.blockers}
            </span>
          </h3>
          {columns.blockers.map((task) => {
            if (
              (selectedUser === "" || task.assignedTo === selectedUser) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              task.project
                .toLowerCase()
                .includes(searchQueryProject.toLowerCase())
            ) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              );
            }
            return null;
          })}
        </div>
        <div
          className="column"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, "verification")}
        >
          <h3>
            Verification{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#097969",
                fontSize: "14px",
              }}
            >
              {taskCounts.verification}
            </span>
          </h3>
          {columns.verification.map((task) => {
            if (
              (selectedUser === "" || task.assignedTo === selectedUser) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              task.project
                .toLowerCase()
                .includes(searchQueryProject.toLowerCase())
            ) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              );
            }
            return null;
          })}
        </div>
        <div
          className="column"
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, "completed")}
        >
          <h3>
            Completed{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "#097969",
                fontSize: "14px",
              }}
            >
              {taskCounts.completed}
            </span>
          </h3>
          {columns.completed.map((task) => {
            if (
              (selectedUser === "" || task.assignedTo === selectedUser) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
              task.project
                .toLowerCase()
                .includes(searchQueryProject.toLowerCase())
            ) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
