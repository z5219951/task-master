import React, { useEffect, useState } from 'react';
import axios from 'axios';
import store from '../store';
import { useHistory } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const UpdateTask = (props) => {
  
  const history = useHistory();
  function backClick () {
    history.push('./taskboard')
  }
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startD, setStartD] = useState('');
  const [dueD, setDueD] = useState('');
  const [cState, setCState] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [startDAlert, setStartDAlert] = useState('')
  const [dueDAlert, setDueDAlert] = useState('')
  const [timeEst, setTimeEst] = useState('')
  const [progress, setProgress] = useState('')
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get task
  const [task, setTask] = useState('')
  const taskID = props.location.state.id;
  useEffect(() => {
    axios.get(`http://localhost:5000/user/${store.getState().id}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data).tasks;
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskID) {
          setTask(taskList[i])
        }
      }
    })
  }, [])

  function handleSubmit () {

    const updateTask = {...task}; // Copy task into updateTask

    if (name !== '') {
      updateTask.title = name;
    }

    if (description !== '') {
      updateTask.description = description;
    }

    if (timeEst !== '') {
      updateTask.time_estimate = timeEst;
    }

    if (progress !== '') {
      updateTask.progress = progress;
    }

    if (difficulty !== '') {
      updateTask.difficulty = difficulty;
    }

    if (cState !== '') {
      updateTask.current_state = cState;
    }

    if (dueD !== '' && startD === '') {
      if (dueD < updateTask.creation_date) {
        setDueDAlert('Please enter a due date after the start date')
      }
      updateTask.deadline = dueD
    }

    if (dueD === '' && startD !== '') {
      if (startD > updateTask.deadline) {
        setStartDAlert('Please enter a start date before the due date')
        return
      }
      updateTask.creation_date = startD
    }

    if (dueD !== '' && startD !== '') {
      if (dueD < startD) {
        setDueDAlert('Please enter a due date after the start date')
        return
      }
      updateTask.deadline = dueD
      updateTask.creation_date = startD
    }
    
    setTask(updateTask)
    handleShow()
    setStartDAlert('')
    setDueDAlert('')
  }

  useEffect(() => {
    if (Object.keys(task).length !== 0) {
      axios.put(`http://localhost:5000/tasks/update `, task)
      console.log(task)
    } 
  },[task])

  return(
    <>
      <div className="m-5">
      <div className="row">
        <h1 className="col">Updating Task #{task.id}: {task.title}</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <h3>Please enter the fields you wish to update</h3>
      <br/>
      <div className="form">
        <div className="form-group row mb-5">
          <label htmlFor="name" className="col-sm-3 col-form-label">Update Task Name</label>
          <div className="col-sm-5">
            <input type="text" className="form-control" id="title" placeholder="Task Name" onChange={(e) => setName(e.target.value)}></input>
            &nbsp;&nbsp;Current Task Name - {task.title}
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Update Task Description</label>
          <div className="col-sm-5">
          <textarea className="form-control" rows="3" id="description" placeholder="Task Description" onChange={(e) => setDescription(e.target.value)}></textarea>
            &nbsp;&nbsp;Current Task Description - {task.description}
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="dueD" className="col-sm-3 col-form-label">Update Deadline</label>
          <div className="col-sm-4">
            <input className="form-control input-sm" type="date" id="DueD" onChange={(e) => setDueD(e.target.value)}></input>
            &nbsp;&nbsp;Current Deadline - {task.deadline}
            <br/>
            <font color="red">{dueDAlert}</font>
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Update Time Estimate (Number of Hours)</label>
          <div className="col-sm-4">
            <input className="form-control input-lg" type="number" min="0" onChange={(e) => setTimeEst(e.target.value)} ></input>
            &nbsp;&nbsp;Current Time Estimate - {task.time_estimate} hours
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="cState" className="col-sm-3 col-form-label">Update Completion State</label>
          <div className="col-sm-5">
            <select className="form-control input-sm" id="state" type="text" onChange={(e) => setCState(e.target.value)}>
              <option value=''></option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Completed</option>
            </select>
            &nbsp;&nbsp;Current Completion State - {task.current_state}
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
      </div>
      <Modal animation={false} show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Task #{task.id} has been Updated!</Modal.Title>
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

export default UpdateTask