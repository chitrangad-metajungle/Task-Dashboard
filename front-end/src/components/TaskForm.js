import React, { useState, useEffect } from "react";
import { getCookieValue } from "../Utility/token_functions";
import axios from "axios";
import "../styles/task.css"
import "../styles/task2.scss"

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


import { createTheme, ThemeProvider } from "@mui/material/styles";

const TaskForm = ({ addTask }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#18a27a',
        darker: '#053e85',
      }
    },
  });
  
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
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <Box
              sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              }}
          >
              {/* <Typography component="h1" variant="h5"> */}
                Add New Task
              {/* </Typography> */}
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                />
                <FormControl sx={{ width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">Project:</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={project}
                    label="Project"
                    onChange={handleProjectChange}
                    required
                  >
                    {projectList.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                  {showNewProjectInput ? (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="project"
                      label="New Project"
                      name="project"
                      autoComplete="project"
                      autoFocus
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
                </FormControl>

                <FormControl sx={{ m:1, width: 300 }}>
                  <InputLabel id="demo-multiple-checkbox-label">Priority:</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={priority}
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    <MenuItem key="" value="">Select Priority</MenuItem>
                    <MenuItem key="red" value="red">Red (highest)</MenuItem>
                    <MenuItem key="yellow" value="yellow">Yellow</MenuItem>
                    <MenuItem key="blue" value="blue">Blue (lowest)</MenuItem>
                  </Select>
                </FormControl>
                

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                      id="completionDate"
                      label="Completion Date" 
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      required
                    />
                  </DemoContainer>
                </LocalizationProvider>

                <FormControlLabel 
                  control={
                    <Checkbox 
                      label="Auto Assign Task"
                      type="checkbox"
                      id="autoAssign"
                      checked={autoAssign}
                      onChange={() => setAutoAssign(!autoAssign)}
                    />
                  } 
                  label="Auto Assign Task" 
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleAddNewProject}
                >
                    Add New Project
                </Button>
              </Box>
            </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default TaskForm;
