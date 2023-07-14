import React from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import '../styles/kanban.css'; 
import {getCookieValue} from "../Utility/token_functions"

const Dashboard = ({addTask, tasks}) => {

  // console.log(getCookieValue('token'))
  if(getCookieValue('token')==null || getCookieValue('token')==undefined)
  {
    window.location.href = "/login";
  }

  return (
    <div>
      <div className='header'>
        <h1>Task Dashboard</h1>
      </div>
      <TaskForm addTask={addTask} />
      <TaskList  tasks={tasks} />
    </div>
  );
};

export default Dashboard;
