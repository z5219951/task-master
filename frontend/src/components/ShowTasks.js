import TaskCard from '../components/TaskCard'
import React, { useEffect, useState } from 'react';

const ShowTasks = (props) => {

  console.log(props)
  const [tasks, setTasks] = useState(props.tasks);

  return(
    <>
    <div className="card">
      <br/>
        {tasks && tasks.map((task) => {
            return <TaskCard key={task.id} task={task}/>
        })}
    </div>
    </>
  )
}

export default ShowTasks