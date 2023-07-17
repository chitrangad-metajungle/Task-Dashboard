import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<Dashboard addTask={addTask} tasks={tasks} />}
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
