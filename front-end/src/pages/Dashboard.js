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
  const [display, setDisplay] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setDisplay("Profile");
  };

  const handleiDashboardClick = () => {
    setDisplay("Dashboard");
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
    <div>
      <Header sidebarWidth={sidebarWidth} open={open} handleSidebarOpen={handleSidebarOpen} profileClick={handleProfileClick} handleiDashboardClick={handleiDashboardClick}></Header>
      <div className="dashboard_container">
        
        <Sidebar sidebarWidth={sidebarWidth} open={open} handleSidebarClose={handleSidebarClose} handleiDashboardClick={handleiDashboardClick}></Sidebar>
        {display=="Profile" && <Profile profileClick={handleProfileClick} />}
        {
          display=="Dashboard" && 
          <div>
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} />
          </div>
        }
        
      </div>
    </div>
  );
};

export default Dashboard;
