import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Header from "../components/Header";
import "../styles/kanban.css";
import { getCookieValue } from "../Utility/token_functions";
import Profile from "../components/Profile";

const Dashboard = ({ addTask, tasks }) => {
  const [displayProfile, setDisplayProfile] = useState(false);

  const handleProfileClick = () => {
    setDisplayProfile(!displayProfile);
  };

  useEffect(() => {
    // if(getCookieValue('token')==null || getCookieValue('token')==undefined)
    // {
    //   window.location.href = "/login";
    // }
  }, []);

  const [open, setOpen] = useState(true);

  const handleSidebarOpen = () => {
    setOpen(true);
  };

  const handleSidebarClose = () => {
    setOpen(false);
  };

  return (
    <div className="dashboard_container">
      <Header profileClick={handleProfileClick} />
      {displayProfile ? (
        <Profile profileClick={handleProfileClick} />
      ) : (
        <div>
          <TaskForm addTask={addTask} />
          <TaskList tasks={tasks} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
