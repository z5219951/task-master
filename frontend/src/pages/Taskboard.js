import CreateTask from './CreateTask';
import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Taskboard = () => {
  const history = useHistory();

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
      <div class="text-right mb-3">
        <button type="button" class="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <div class="card">
          <h5 class="card-title">My Tasks:</h5>
          <br/>
          {tasks}
        </div>
      </div>
    </>
  )
}

export default Taskboard;