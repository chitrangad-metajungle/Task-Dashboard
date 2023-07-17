import React, { useEffect, useState } from "react";
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/kanban.css'; 
import {getCookieValue} from "../Utility/token_functions"

const sidebarWidth = 240;

const Dashboard = ({addTask, tasks}) => {

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
    <div className='dashboard_container'>
      <Header sidebarWidth={sidebarWidth} open={open} handleSidebarOpen={handleSidebarOpen}></Header>
      <Sidebar sidebarWidth={sidebarWidth} open={open} handleSidebarClose={handleSidebarClose}></Sidebar>
      <TaskForm addTask={addTask} />
      <TaskList  tasks={tasks} />
    </div>
  );
};

export default Dashboard;
