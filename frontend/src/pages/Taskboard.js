import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchTask from '../components/SearchTask'
import ShowTasks from '../components/ShowTasks'
import { ToggleButton } from 'react-bootstrap';

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

  function createProject() {
    history.push('/createProject')
  }

  // Get tasks created by and assigned to the logged in user
  axios.defaults.crossDomain=true;
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      setCreatedTasks(taskList)
    })

    axios.get(`http://localhost:5000/tasks/assigned/${store.getState().id}`).then((res) => {
      console.log(res.data)
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
      <div className="text-right mb-1">
        <button type="button" className="btn btn-success btn-lg mb-5" onClick={() => { createProject()}}> Create Project - add tasks to a project </button> &nbsp;
        <button type="button" className="btn btn-success btn-lg mb-5" > View my Projects</button>
      </div>
        <button type="button" className="btn btn-primary btn-lg w-100" onClick={() => { createTask()}}> Create Task - for smaller individual assignments </button>
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