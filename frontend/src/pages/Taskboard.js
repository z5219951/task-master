import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchTask from '../components/SearchTask'
import ShowTasks from '../components/ShowTasks'

const Taskboard = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState('');

  if (store.getState() === undefined || store.getState().id === "") {
    history.push('/home')
  }

  function createTask() {
    history.push('/createTask')
  }

  // Get tasks created by the logged in user
  axios.defaults.crossDomain=true;
  useEffect(() => {
    axios.get(`http://localhost:5000/user/${store.getState().id}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data).tasks;
      setTasks(taskList)
    })
  }, [])

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <SearchTask />
      <br/>
      <div className="text-right mb-3">
        <button type="button" className="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <h5 className="card-title">My Tasks:</h5>
        <ShowTasks key={tasks} tasks={tasks}/>
      </div>
    </>
  )
}

export default Taskboard;