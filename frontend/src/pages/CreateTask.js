import './Padding.css'
import './CreateTask.css'
import React, { Component, Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import store from '../store'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const CreateTask = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueD, setDueD] = useState('');
  const [cState, setCState] = useState('Not Started');
  const [dueDAlert, setDueDAlert] = useState('')
  const [nameAlert, setNameAlert] = useState('')
  const [descriptionAlert, setDescriptionAlert] = useState('')
  const [timeEst, setTimeEst] = useState(0)
  const [owner, setOwner] = useState('')
  const [labels, setLabels] = useState('')
  const [existingLabels, setExistingLabels] = useState('')

  var today = new Date();
  const currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

  function backClick () {
    history.push('./taskboard')
  }

  function handleSubmit () {
    if (name === '') {
      setNameAlert('Please enter a task name!')
      return
    } else {
      setNameAlert('');
    }

    if (description === '') {
      setDescriptionAlert('Please enter a description!')
      return
    } else {
      setDescriptionAlert('');
    }

    if (dueD !== '' && Date.parse(dueD) < Date.parse(currentDate)) {
      setDueDAlert('Please enter a valid deadline')
      return
    }
    const options = []

    // Create task object and push it to server
    const task = {title: name, description: description, creation_date: currentDate, deadline: dueD, time_estimate: timeEst, current_state: cState, owner: owner, labels: labels}
    console.log(task)
    axios.defaults.crossDomain=true;
    axios.post('http://localhost:5000/create_task', task).then(()=>{
      console.log("Task Created");
      history.push('./taskboard');
    })
  }
  
  useEffect(() => {
    setOwner(store.getState().id)
    // test
    setExistingLabels([{label:'frontend', value:'frontend'},{label:'backend', value:'backend'}])
  }, [])

  useEffect(() => {
    console.log(labels)
  }, [labels])

  // Obtain existing labels
  /*
  axios.get(`http://localhost:5000/labels/${store.getState().id}`).then((res) => {
    const labelList = JSON.parse(res.data)
    const temp = labelList.map((label) =>)
  })*/
  
  function handleLabels(labels) {
    setLabels(JSON.stringify(labels))
    // Post new labels
    //axios.post(`http://localhost:5000/labels/${store.getState().id}`)
  }

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
            <label htmlFor="name">Task Name<span className='redStar'>*</span></label>
            <input className="form-control input-sm" type="text" id="name" onChange={(e) => setName(e.target.value)}></input>
            <div><font color="red">{nameAlert}</font></div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-4">
            <label htmlFor="description">Task Description<span className='redStar'>*</span></label>
            <textarea className="form-control" rows="3" id="description" onChange={(e) => setDescription(e.target.value)}></textarea>
            <div><font color="red">{descriptionAlert}</font></div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-3">
            <label htmlFor="endD">Deadline (Optional)</label>
            <input className="form-control input-sm" type="date" id="endD" onChange={(e) => setDueD(e.target.value)}></input>
          </div>
        <div><font color="red">{dueDAlert}</font></div>
        </div>
        <div className="form-group">
          <div className="col-md-3">
            <label htmlFor="time">Time Estimate (Number of Hours)</label>
            <input className="form-control input-lg" value={timeEst} type="number" min="0" onChange={(e) => setTimeEst(e.target.value)}></input>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-6">
            <label htmlFor="assign">Assign Task</label>
            <Select placeholder='Search for a user to assign this task to' options={existingLabels}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-6">
            <label htmlFor="assign">Labels</label>
            <CreatableSelect isMulti placeholder='Create a label by typing here or select a label below' onChange={(e) => handleLabels(e)} options={existingLabels}/>
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