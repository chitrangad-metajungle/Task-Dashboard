import React, { useState, useEffect } from "react";
import { getCookieValue } from "../Utility/token_functions";
import axios from "axios";

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [priority, setPriority] = useState("");
  const [autoAssign, setAutoAssign] = useState(false);
  const [project, setProject] = useState("");
  const [projectList, setProjectList] = useState(["AI"]);
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);

  useEffect(() => {
    async function fetchProjectList() {
      try {
        const response = await axios.get("http://localhost:8000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tempList = response.data.map((i) => {
          return i.project;
        });

        setProjectList(tempList);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjectList();
  }, [projectList]);

  // useEffect(() => {
  //   localStorage.setItem("projectList", JSON.stringify(projectList));
  // }, [projectList]);

  const token = getCookieValue("token"); // Replace 'getCookie' with your cookie retrieval logic
  const addTaskToDatabase = async (newTask) => {
    const response = await fetch("http://localhost:8000/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
  };

  const handleSubmit = (e) => {
    //e.preventDefault();

    let assignedTo = "";
    let status = "todo";

    if (autoAssign) {
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const users = ["User1", "User2", "User3"];

      if (storedTasks.length > 0) {
        const tasksCount = {};
        users.forEach((user) => {
          tasksCount[user] = storedTasks.filter(
            (task) => task.assignedTo === user
          ).length;
        });

        const minTasksCount = Math.min(...Object.values(tasksCount));
        const usersWithMinTasks = Object.keys(tasksCount).filter(
          (user) => tasksCount[user] === minTasksCount
        );

        assignedTo =
          usersWithMinTasks[
            Math.floor(Math.random() * usersWithMinTasks.length)
          ];
        status = "inProcess";
      } else {
        assignedTo = users[Math.floor(Math.random() * users.length)];
        status = "inProcess";
      }
    }

    const newTask = {
      id: title,
      title,
      completionDate,
      priority,
      assignedTo,
      status,
      project,
    };

    addTask(newTask);
    addTaskToDatabase(newTask);

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(storedTasks));

    setTitle("");
    setCompletionDate("");
    setPriority("");
    setAutoAssign(false);
  };

  const handleProjectChange = (e) => {
    setProject(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputProject = e.target.value.trim();
      const existingProject = projectList.find(
        (option) => option.toLowerCase() === inputProject.toLowerCase()
      );

      if (!existingProject && inputProject !== "") {
        //setProjectList([...projectList, inputProject]);
        async function addProject(inputProject) {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/projects",
              {
                project: inputProject,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (error) {
            console.error(error);
          }
        }

        addProject(inputProject);
        setProject("");
        setShowNewProjectInput(false);
      }
    }
  };

  const handleAddNewProject = () => {
    setShowNewProjectInput(true);
  };

  return (
    <div>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          <h4>Title:</h4>
        </label>
        <input
          style={{ marginBottom: "-5px", marginTop: "1px" }}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="project">
          <h4>Project:</h4>
        </label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            style={{ marginBottom: "-5px", marginTop: "1px" }}
            id="project"
            value={project}
            onChange={handleProjectChange}
            required
          >
            <option value="">Select Project</option>
            {projectList.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {showNewProjectInput ? (
            <input
              type="text"
              placeholder="New Project"
              value={project}
              onChange={handleProjectChange}
              onKeyPress={handleKeyPress}
            />
          ) : (
            <span
              style={{
                marginBottom: "-7px",
                marginLeft: "7px",
                cursor: "pointer",
                color: "#097969",
                fontSize: "10px",
              }}
              onClick={handleAddNewProject}
            >
              Add New Project
            </span>
          )}
        </div>

        <label htmlFor="completionDate">
          <h4>Completion Date:</h4>
        </label>
        <input
          style={{ marginBottom: "-5px", marginTop: "1px" }}
          type="date"
          id="completionDate"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
          required
        />

        <label htmlFor="priority">
          <h4>Priority:</h4>
        </label>
        <select
          style={{ marginBottom: "-5px", marginTop: "1px" }}
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Select Priority</option>
          <option value="red">Red (highest)</option>
          <option value="yellow">Yellow</option>
          <option value="blue">Blue (lowest)</option>
        </select>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              marginRight: "-210px",
              marginBottom: "10px",
              marginTop: "-1px",
            }}
            htmlFor="autoAssign"
          >
            <h4>Auto Assign Task</h4>
          </label>
          <input
            style={{
              marginBottom: "-2px",
              marginTop: "1px",
              marginLeft: "77px",
            }}
            type="checkbox"
            id="autoAssign"
            checked={autoAssign}
            onChange={() => setAutoAssign(!autoAssign)}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
