import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard'

const Taskboard = () => {
  const history = useHistory();

  if (store.getState() === undefined || store.getState().id === "") {
    history.push('/home')
  }

  function createTask() {
    history.push('/createTask')
  }

  const [tasks, setTasks] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then((res) => {
      const taskList = res.data;
      for (let i = 0; taskList.length > i; i++) {
        if (store.getState().id === taskList[i].owner) {
          console.log(taskList[i])
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
        <h5 className="card-title text-middle">My Tasks:</h5>
        <div className="card">
          <br/>
          {tasks && tasks.map((task) => {
            return <TaskCard task={task}/>
          })}
        </div>
      </div>
    </>
  )
}

export default Taskboard;