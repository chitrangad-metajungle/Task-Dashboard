import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("TaskList");

  const handleProfileClick = () => {
    setDisplay("Profile");
  };

  const handleTaskFormClick = () => {
    setDisplay("TaskForm");
  };

  const handleTaskListClick = () => {
    setDisplay("TaskList");
  };

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleSidebarOpen = () => {
    setOpen(true);
  };

  const handleSidebarClose = () => {
    setOpen(false);
  };

  const sidebarWidth = 240;

  return (
    <Router>
      <Header
        sidebarWidth={sidebarWidth}
        open={open}
        handleSidebarOpen={handleSidebarOpen}
        profileClick={handleProfileClick}
      ></Header>
      <div>
        <Sidebar
          sidebarWidth={sidebarWidth}
          open={open}
          handleSidebarClose={handleSidebarClose}
          handleTaskFormClick={handleTaskFormClick}
          handleTaskListClick={handleTaskListClick}
        ></Sidebar>
        <Routes>
          <Route
            path="/"
            element={<Dashboard addTask={addTask} tasks={tasks} display={display}/>}
          />
          <Route
            path="/tasks/:taskId"
            element={<TaskDetails tasks={tasks} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
