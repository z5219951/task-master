import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchTask from '../components/SearchTask'
import ShowTasks from '../components/ShowTasks'

const Taskboard = () => {
  const history = useHistory();
  const [createdTasks, setCreatedTasks] = useState('');
  const [assignedTasks, setAssignedTasks] = useState('');
  const [toggleBool, setToggleBool] = useState(false)
  const [toggleLabel, setToggleLabel] = useState('View Created Tasks');

  if (store.getState() === undefined || store.getState().id === "") {
    history.push('/home')
  }

  function createTask() {
    history.push('/createTask')
  }

  // Get tasks created by and assigned to the logged in user
  axios.defaults.crossDomain=true;
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/created/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      setCreatedTasks(taskList)
    })

    axios.get(`http://localhost:5000/tasks/assigned/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      setAssignedTasks(taskList)
    })
  }, [])

  function toggleButton () {
    if (!toggleBool) {
      setToggleBool(true)
      setToggleLabel('View Assigned Tasks')
    } else {
      setToggleBool(false)
      setToggleLabel('View Created Tasks')
    }
  }

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <SearchTask />
      <br/>
        <button type="button" className="btn btn-primary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button>
        <br/><br/>
        <button type="button" className="btn btn-warning btn-lg mb-5" onClick={() => { toggleButton()}}>{toggleLabel}</button>
        {toggleBool?  
        <div>
          <h2 className="card-title">Tasks I created:</h2>
          <ShowTasks key={createdTasks} tasks={createdTasks} update="true"/>
       </div>
        : 
        <div> 
          <h2 className="card-title">Tasks I am assigned to:</h2> 
          <ShowTasks key={assignedTasks} tasks={assignedTasks} update="true"/>
        </div>
        }
      </div>
    </>
  )
}

export default Taskboard;