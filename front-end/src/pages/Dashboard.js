import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/kanban.css";
import { getCookieValue } from "../Utility/token_functions";
import Profile from "../components/Profile";

const sidebarWidth = 240

const Dashboard = ({ addTask, tasks }) => {
  const [displayProfile, setDisplayProfile] = useState(false);
  const [displayDashboard, setDisplayDashboard] = useState(true);
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setDisplayProfile(true);
    setDisplayDashboard(false);
  };

  const handleiDashboardClick = () => {
    setDisplayDashboard(true);
    setDisplayProfile(false);
  };

  useEffect(() => {
    // if(getCookieValue('token')==null || getCookieValue('token')==undefined)
    // {
    //   window.location.href = "/login";
    // }
  }, []);


  const handleSidebarOpen = () => {
    setOpen(true);
  };

  const handleSidebarClose = () => {
    setOpen(false);
  };

  return (
    <div className="dashboard_container">
      <Header sidebarWidth={sidebarWidth} open={open} handleSidebarOpen={handleSidebarOpen} profileClick={handleProfileClick} handleiDashboardClick={handleiDashboardClick}></Header>
      <Sidebar sidebarWidth={sidebarWidth} open={open} handleSidebarClose={handleSidebarClose}></Sidebar>
      {displayProfile && <Profile profileClick={handleProfileClick} />}
      {
        displayDashboard && 
        <div>
          <TaskForm addTask={addTask} />
          <TaskList tasks={tasks} />
        </div>
      }
       
    </div>
  );
};

export default Dashboard;
