import { useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import store from '../store';

const UpdateProject = (props) => {
  const project = props.location.state.project
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState('')
  const [taskList, setTaskList] = useState([])
  const [connectedTasks, setConnectedTasks] = useState(project.tasks)
  const [selectedTasks, setSelectedTasks] = useState('')
  const [first, setFirst] = useState(0)
  let newTaskList = [...taskList]
  function backClick () {
    history.goBack()
  }

   // Get tasks created by the logged in user
   axios.defaults.crossDomain=true;
   useEffect(() => {
     /*
     axios.get(`http://localhost:5000/groups/${project.groupid}/tasks`).then((res) => {
       const taskList = JSON.parse(res.data);
       setTasks(taskList)
       console.log(taskList)
     })
*/
     setTasks([{"id":"1","owner":"2","title":"task 1","description":"abc","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"},
     {"id":"2","owner":"2","title":"task 2 ","description":"def","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"},
     {"id":"3","owner":"2","title":"task 3","description":"ghi","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"}]
     )

     setSelectedTasks([{"id":"1","owner":"2","title":"task 1","description":"abc","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"},
     {"id":"2","owner":"2","title":"task 2 ","description":"def","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"}]
     )
     setTaskList(newTaskList)
   }, [])

   useEffect(() => {

   }, [tasks])

   function handleView (task) {
    history.push({
      pathname: './viewTask',
      task: { task }
    })
  }

  function handleTasks(e) {
    
    if (e.target.checked === false) {
      newTaskList[e.target.value] = false
    } else {
      newTaskList[e.target.value] = true
    }
    setTaskList(newTaskList)

    setConnectedTasks([])
  }

  useEffect(() => {
    setConnectedTasks([])
    if (tasks) {
      tasks.map((task, index) => {
        if (taskList[index]) {
          setConnectedTasks(connectedTasks => [...connectedTasks, Number(task.id)])
        }
      })
    }
  }, [taskList])

  useEffect(() => {
    console.log(connectedTasks)
  }, [connectedTasks])

  function handleSubmit () {
    
    const updateProject = {'id': store.getState().id, 'groupid': project.groupid, 'name': project.name, 'description': project.description, 'tasks': connectedTasks}
    console.log(updateProject)
    if (name !== '') {
      updateProject.name = name
      project.name = name
      console.log(project.name)
    } 

    if (description !== '') {
      updateProject.description = description
      project.description = description
    }

    updateProject.tasks = JSON.stringify(connectedTasks)
    project.tasks = connectedTasks
    console.log(updateProject)
    axios.put(`http://localhost:5000/projects/update`, updateProject).then((res) => {
      console.log(res)
    })
  }

  // Checks if task is already in the project
  function checkSelected (tasks, id, index) {
    var checked = 'false'
    if (tasks.length > 0) {
      checked = tasks.some(task => task.id === id)
    }

    if (checked && newTaskList[index] !== false) {
      newTaskList[index] = true
    }

    if (first === 0 ) {
      console.log(newTaskList)
      setTaskList(newTaskList)
      setFirst(1)
    }
    return checked
  }

  return(
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Updating Project #{project.id} - {project.name}</h1>
        <br />
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
        <h3>Please enter the fields you wish to update</h3>
        <br />
      </div>
      <form>
        <div className="form-group row mb-5">
          <label htmlFor="name" className="col-sm-3 col-form-label">Update Project Name</label>
          <div className="col-sm-5">
            <input className="form-control input-sm" type="text" id="name" onChange={(e) => setName(e.target.value)}></input>
            &nbsp;&nbsp;Current Project Name - {project.name}
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Update Project Description</label>
          <div className="col-sm-5">
            <textarea className="form-control" rows="3" id="description" onChange={(e) => setDescription(e.target.value)}></textarea>
            &nbsp;&nbsp;Current Project Description - {project.description}
          </div>
        </div> 
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Tasks</label>
          <div className="col">
          {tasks ? tasks.map((task, index) => {
            return <div key={task.id}>
              <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleTasks(e)} defaultChecked={checkSelected(selectedTasks, task.id, index)} key={index} value={index}/>Task #{task.id} - {task.title} &nbsp;
              <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
              </h5> 
              <br/></div>
          }) : 'No Tasks Available'} 
        </div> 
      </div>
        <button type="button" className="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
      </form>
    </div>
    </>
  )
}

export default UpdateProject
/*
{tasks ? tasks.map((task, index) => {
  return <div key={task.id}>
    <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleTasks(e)} defaultChecked={checkSelected(project.tasks, task.id)} key={index} value={index}/>Task #{task.id} - {task.title} &nbsp;
    <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
    </h5> 
    <br/></div>
}) : 'No Tasks Available'}   */