import './Padding.css'
import './CreateTask.css'
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import store from '../store'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const CreateTask = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueD, setDueD] = useState(null);
  const [cState, setCState] = useState('Not Started');
  const [dueDAlert, setDueDAlert] = useState('')
  const [nameAlert, setNameAlert] = useState('')
  const [descriptionAlert, setDescriptionAlert] = useState('')
  const [timeEst, setTimeEst] = useState(0)
  const [owner, setOwner] = useState('')
  const [labels, setLabels] = useState('')
  const [existingLabels, setExistingLabels] = useState('')
  const [formattedLabels, setFormattedLabels] = useState('')
  const [friends, setFriends] = useState([{label: 'Myself', value:store.getState().id}])
  const [assigned_to, setAssigned_to] = useState(store.getState().id)
  const [timeTaken, setTimeTaken] = useState(0)

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

    if (dueD !== 'null' && Date.parse(dueD) < Date.parse(currentDate)) {
      setDueDAlert('Please enter a valid deadline')
      return
    }
    const options = []

    // Create task object and push it to server
    const task = {title: name, description: description, creation_date: currentDate, deadline: dueD, time_estimate: timeEst, current_state: cState, owner: owner, labels: labels, assigned_to: assigned_to, time_taken: timeTaken}
    axios.defaults.crossDomain=true;
    axios.post('http://localhost:5000/tasks/create', task).then(()=>{
      history.push('./taskboard');
    })
  }
  
  useEffect(() => {
    setOwner(store.getState().id)
    
    //Obtain connected users
    axios.get(`http://localhost:5000/friends/lists/${store.getState().id}`).then((res) => {
      const temp = JSON.parse(res.data)
      temp.map((user) => {
        setFriends(friends => [...friends,{'value': user.requestedUser, 'label': user.email}])
      })
    })
    
    handleExistingLabels()

  }, [])

  // Set formatted labels 
  useEffect(()=> {
    setFormattedLabels('')
    if (existingLabels.length !== 0) {
      existingLabels.map((label) => {
        const data = ({label: label, value: label})
        setFormattedLabels(formattedLabels=>[...formattedLabels, data])
      })
    }
  }, [existingLabels])
  
  // Handles labels when they are changed
  function handleLabels(labels) {
    setLabels(JSON.stringify(labels))
    const temp = labels
    temp.map((label) => {
      if (existingLabels.includes(label.value) === false) {
        const data = {'labels': JSON.stringify(label.value)}
        axios.post(`http://localhost:5000/labels/${store.getState().id}`, data)
        setExistingLabels(existingLabels => [...existingLabels, label.value])
      }
    })
  }

  // Obtains existing labels from server
  function handleExistingLabels() {
    setExistingLabels('')
    axios.get(`http://localhost:5000/labels/${store.getState().id}`).then((res) => {
      if (res.data != 'null') {
        const temp = JSON.parse(res.data).replace(/['"]+/g, '').split(', ')
        setExistingLabels(temp)
      }
    })
  }
  
  function handleAssigned(assigned) {
    setAssigned_to(assigned.value)
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
            <input className="form-control input-sm" type="date" defaultValue='null' id="endD" onChange={(e) => setDueD(e.target.value)}></input>
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
          <div className="col-md-5">
            <label htmlFor="time">Time Taken to Complete (Number of Hours)</label>
            <input className="form-control input-lg" value={timeTaken} type="number" min="0" onChange={(e) => setTimeTaken(e.target.value)}></input>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-6">
            <label htmlFor="assign">Assign Task - defaults to you if not selected</label>
            <Select placeholder='Search for a user to assign this task to' defaultValue='' options={friends} onChange={(e) => handleAssigned(e)}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-6">
            <label htmlFor="assign">Labels</label>
            <CreatableSelect isMulti placeholder='Create a label by typing here or select a label below' options={formattedLabels} onChange={(e) => handleLabels(e)}/>
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