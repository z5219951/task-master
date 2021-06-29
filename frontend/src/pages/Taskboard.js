import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard'

const Taskboard = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState('');

  if (store.getState() === undefined || store.getState().id === "") {
    history.push('/home')
  }

  function createTask() {
    history.push('/createTask')
  }
  
  // Return statement cycles through tasks in each completion state while rendering
  const cState = ['Not Started','In Progress', 'Completed', 'Blocked' ];

  // Get tasks created by the logged in user
  axios.defaults.crossDomain=true;
  useEffect(() => {
    axios.get(`http://localhost:5000/user/${store.getState().id}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data).tasks;
      console.log(taskList)
      for (let i = 0; taskList.length > i; i++) {
        if (store.getState().id == taskList[i].owner) {
          setTasks(tasks => [...tasks, taskList[i]])
        }     
      }
    })
  }, [])

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <br/>
      <div className="text-right mb-3">
        <button type="button" className="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <h5 className="card-title">My Tasks:</h5>
        <div className="card">
          <br/>
            {cState.map((state) => {
                return <div key={state} className="card m-4">
                <h5 className="card-title m-2">{state}:</h5>
                {tasks && tasks.map((task) => {
                  if (JSON.stringify(task.current_state) === JSON.stringify(state)) {
                    return <TaskCard key={task.id} task={task}/>
                  }
              })}
              </div>
            })}
        </div>
      </div>
    </>
  )
}

export default Taskboard;