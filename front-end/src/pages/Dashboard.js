import React, { useState, useEffect } from "react";
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Header from '../components/Header';
import '../styles/kanban.css'; 
import "../styles/Dashboard.css"
import {getCookieValue} from "../Utility/token_functions"

const Dashboard = ({addTask, tasks}) => {

  useEffect(() => {
    // if(getCookieValue('token')==null || getCookieValue('token')==undefined)
    // {
    //   window.location.href = "/login";
    // }
  }, []);

  return (
    <div className='dashboard_container'>
      <Header></Header>
      <TaskForm addTask={addTask} />
      <TaskList  tasks={tasks} />
    </div>
  );
};

export default Dashboard;
