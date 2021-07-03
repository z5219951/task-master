import './Padding.css'
import './CreateTask.css'
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import store from '../store'

const CreateTask = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startD, setStartD] = useState('');
  const [dueD, setDueD] = useState('');
  const [cState, setCState] = useState('Not Started');
  const [difficulty, setDifficulty] = useState('Very Easy');
  const [dueDAlert, setDueDAlert] = useState('')
  const [progress, setProgress] = useState(0)
  const [nameAlert, setNameAlert] = useState('')
  const [descriptionAlert, setDescriptionAlert] = useState('')
  const [startDAlert, setStartDAlert] = useState('')
  const [timeEst, setTimeEst] = useState(0)
  const [owner, setOwner] = useState('')

  function backClick () {
    history.push('./taskboard')
  }

  function handleSubmit () {
    if (name === '') {
      setNameAlert('Please input a task name!')
      return
    } else {
      setNameAlert('');
    }

    if (description === '') {
      setDescriptionAlert('Please input a description!')
      return
    } else {
      setDescriptionAlert('');
    }

    if (startD === '') {
      setStartDAlert('Please input a start date!')
      return
    } else {
      setStartDAlert('');
    }

    if (dueD === '') {
      setDueDAlert('Please input a due date! ')
      return
    } else {
      setDueDAlert('');
    }

    // Create task object and push it to server
    const task = {title: name, description: description, creation_date: startD, deadline: dueD, progress: progress,time_estimate: timeEst, difficulty: difficulty, current_state: cState, owner: owner}
    console.log(task)
    axios.defaults.crossDomain=true;
    axios.post('http://localhost:5000/create_task', task).then(()=>{
      console.log("Task Created");
      history.push('./taskboard');
    })
  }

  useEffect(() => {
    setOwner(store.getState().id)
  }, [])

  // Validates date inputs
  useEffect(() => {
    setDueDAlert('')
    if (startD === '' && dueD !== '') {
      setDueDAlert('Please input a start date!')
      return
    }
    if (dueD === '') {
      setDueDAlert('')
      return
    }
    if (dueD < startD) {
      setDueDAlert('Please input a start date before the due date')
    }
  }, [dueD, startD])

  return(
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Create a task</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <form>
        <div className="form-group">
          <div className="col-md-4">
            <label htmlFor="name">Task Name</label>
            <input className="form-control input-sm" type="text" id="name" onChange={(e) => setName(e.target.value)}></input>
            <div><font color="red">{nameAlert}</font></div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-4">
            <label htmlFor="description">Task Description</label>
            <textarea className="form-control" rows="3" id="description" onChange={(e) => setDescription(e.target.value)}></textarea>
            <div><font color="red">{descriptionAlert}</font></div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-2">
            <label htmlFor="startD">Start Date</label>
            <input className="form-control input-sm" type="date" id="startD" onChange={(e) => setStartD(e.target.value)}></input>
            <div><font color="red">{startDAlert}</font></div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-2">
            <label htmlFor="endD">Due Date</label>
            <input className="form-control input-sm" type="date" id="endD" onChange={(e) => setDueD(e.target.value)}></input>
          </div>
        <div><font color="red">{dueDAlert}</font></div>
        </div>
        <div className="form-group">
          <label htmlFor="progress">Progress</label>
          <br/>
          <div className="col-md-3">
            <input className="form-control input-lg" value={progress} type="number" min="0" max="100" onChange={(e) => setProgress(e.target.value)}></input>
            <span>% Complete</span>
          </div>
          <progress value={progress} max="100"> </progress>
        </div>
        <div className="form-group">
          <div className="col-md-3">
            <label htmlFor="time">Time Estimate (Number of Hours)</label>
            <input className="form-control input-lg" value={timeEst} type="number" min="0" onChange={(e) => setTimeEst(e.target.value)}></input>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-2">
            <label htmlFor="inputsm">Difficulty</label>
            <select className="form-control input-sm" id="state" type="text" onChange={(e) => setDifficulty(e.target.value)}>
              <option>Very Easy</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Very Hard</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-2">
            <label htmlFor="state">State of Completion</label>
            <select className="form-control input-sm" id="state" type="text" onChange={(e) => setCState(e.target.value)}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        <br/>
        <button type="button" className="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
      </form>
    </div>
    </>
  )
}

export default CreateTask;