import { useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const UpdateProject = (props) => {
  const project = props.location.state.project
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState('')
  const [taskId, setTaskId] = useState('')
  const [taskList, setTaskList] = useState([])
  const [connectedTasks, setConnectedTasks] = useState(project.tasks)
  const [selectedTasksId, setSelectedTasksId] = useState('')
  const [selectedTasks, setSelectedTasks] = useState('')
  const [first, setFirst] = useState(0)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let newTaskList = [...taskList]
  function backClick () {
    history.goBack()
  }

   // Get tasks created by the logged in user
   axios.defaults.crossDomain=true;
   useEffect(() => {
     
    axios.get(`http://localhost:5000/groups/${project.groupid}/tasks?project=${project.id}`).then((res) => {
      if (res.data.length > 0) {
        setTaskId(JSON.parse(res.data))
      }
    })

    if (project.tasks) {
      setSelectedTasksId(JSON.parse(project.tasks))
    }
  
     setTaskList(newTaskList)
   }, [])

  useEffect(() => {
    if (taskId) {
      taskId.map((id) => {
        axios.get(`http://localhost:5000/tasks/${id}`).then((res) => {
          setTasks(tasks => [...tasks, JSON.parse(res.data)])
        })
      })   
    }
  }, [taskId])

  useEffect(() => {
    if (selectedTasksId) {
      selectedTasksId.map((id) => {
        axios.get(`http://localhost:5000/tasks/${id}`).then((res) => {
          setSelectedTasks(tasks => [...tasks, JSON.parse(res.data)])
        })
      })  
    }
  }, [selectedTasksId])

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

  function handleSubmit () {
    
    const updateProject = {'id': project.id, 'groupid': project.groupid, 'name': project.name, 'description': project.description, 'tasks': connectedTasks}
    if (name !== '') {
      updateProject.name = name
      project.name = name
    } 

    if (description !== '') {
      updateProject.description = description
      project.description = description
    }

    updateProject.tasks = JSON.stringify(connectedTasks)
    project.tasks = connectedTasks
    axios.put(`http://localhost:5000/projects/update`, updateProject).then((res) => {
      handleShow()
    })
  }

  // Checks if task is already in the project
  function checkSelected (tasks, id, index) {
    var checked = 'false'
    if (tasks.length > 0) {
      checked = tasks.some(task => task.id === id)
    } else {
      return
    }

    if (checked && newTaskList[index] !== false) {
      newTaskList[index] = true
    }

    if (first === 0 ) {
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
          <label htmlFor="description" className="col-sm-3 col-form-label">Unassigned tasks from group members</label>
          <div className="col">
          {tasks ? tasks.map((task, index) => {
            return <div key={task.id}>
              <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleTasks(e)} defaultChecked={checkSelected(selectedTasks, task.id, index)} key={index} value={index}/> {task.title} - (Task ID: #{task.id}) &nbsp;
              <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
              </h5> 
              <br/></div>
          }) : 'No Tasks Available'} 
        </div> 
      </div>
        <button type="button" className="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
      </form>
      <Modal animation={false} show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Project #{project.id} has been Updated!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => handleClose()} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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