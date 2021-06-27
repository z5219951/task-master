import CreateTask from './CreateTask';
import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Taskboard = () => {
  const history = useHistory();

  console.log(store.getState())
  if (store.getState() === undefined || store.getState().id === "") {
    history.push('/home')
  }
  
  // Yue just a example
  console.log(store.getState().id);

  function createTask() {
    history.push('/createTask')
  }

  const [tasks, setTasks] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then((res) => {
      
    })
  })

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <br/>
      <div className="text-right mb-3">
        <button type="button" className="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <div className="card">
          <h5 className="card-title">My Tasks:</h5>
          <br/>
          {tasks}
        </div>
      </div>
    </>
  )
}

export default Taskboard;