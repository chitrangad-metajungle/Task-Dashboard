import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import "../styles/kanban.css";
import Profile from "../components/Profile";

const sidebarWidth = 240;

const Dashboard = ({ addTask, tasks, display }) => {

  useEffect(() => {
    // if(getCookieValue('token')==null || getCookieValue('token')==undefined)
    // {
    //   window.location.href = "/login";
    // }
  }, []);

  return (
    <div>
      
      <div className="dashboard_container">
       
        {display == "Profile" && <Profile/>}
        {display == "TaskForm" && (
          <div>
            <TaskForm addTask={addTask} />
          </div>
        )}
        {display == "TaskList" && (
          <div>
            <TaskList tasks={tasks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
