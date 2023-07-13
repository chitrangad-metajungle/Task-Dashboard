import React from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import '../styles/kanban.css'; 

const Dashboard = ({addTask, tasks}) => {


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
