import React from 'react'

const TaskInfo = ({tasks}) => {
  return (
    <div>
        <div>{tasks.map((task) => {
       return <h1 key={task.title}>{task.title}</h1>;
     })}</div>
    </div>
  )
}

export default TaskInfo
