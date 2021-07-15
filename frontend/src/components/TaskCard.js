import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import store from '../store';
import './TaskCard.css'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios'

const TaskCard = (props) => {
  const tasks = props.task
  const [update, setUpdate] = useState(false)
  const history = useHistory();
  const [currentLabels, setCurrentLabels] = useState([])
  const [existingLabels, setExistingLabels] = useState('')
  const [updateLabel, setUpdateLabel] = useState(false)
  const [assigned, setAssigned] = useState('')

  function handleClick() {
    history.push({
      pathname: '/updateTask',
      state: { id: tasks.id }
  });
  }

  useEffect(() => {
     // test
     setExistingLabels([{label:'frontend', value:'frontend'},{label:'backend', value:'backend'}])
     console.log(tasks)
     if (tasks.assigned_to !== '' || tasks.assigned_to !== undefined) {
      axios.get(`http://localhost:5000/user/${tasks.assigned_to}`).then((res) => {
      setAssigned(JSON.parse(res.data).email)
      })
    }
    axios.get(`http://localhost:5000/labels/${store.getState().id}`).then((res) => {
      console.log(res.data)
    })
  },[])

  // Obtain existing labels
  
  useEffect(() => {
    if (parseInt(tasks.owner) === parseInt(store.getState().id)) {
      setUpdate(true)
    }
    
    if (tasks.labels !== '') {
      setCurrentLabels([])
      JSON.parse(tasks.labels).map((label) => {
        setCurrentLabels(currentLabels => [...currentLabels, ' ',label.value])
      })
      //setExistingLabels([{label:'frontend', value:'frontend'},{label:'backend', value:'backend'}])
    } else {
      setCurrentLabels('None')
    }
  },[updateLabel])

  function handleLabels(labels) {
    tasks.labels = JSON.stringify(labels)
    axios.put(`http://localhost:5000/tasks/update `, tasks)
    if (updateLabel) {
      setUpdateLabel(false)
    } else {
      setUpdateLabel(true)
    }
    // Post new labels
    if (labels !== []) {
      console.log(labels)
      labels.map((label) => {
        const data = {'labels': label.value}
        axios.post(`http://localhost:5000/labels/${store.getState().id}`, data).then((res) => {
          console.log(res)
        })
        axios.get(`http://localhost:5000/labels/${store.getState().id}`).then((res) => {
          console.log(res.data)
        })
      })
    }
   
  }

  return (<>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="col">Task ID #{tasks.id}: {tasks.title}</div>
          <div className="col-md-2 btn btn-secondary btn-sm">{update ? <div><button className="btn btn-secondary btn-lg" onClick={() => handleClick()}>Update Task</button><br/></div> : ''}</div>
          <p className="card-text m-1">Task Status: {tasks.current_state}</p>
          <p className="card-text col m-1"><em>Deadline: {tasks.deadline ? tasks.deadline : 'No deadline'} </em></p>
          <p className="card-text col m-1">Estimated completion time: {tasks.time_estimate} hours</p>
        </div>
      </div>
<<<<<<< HEAD
      <div className="card-body text-muted" padding="100px">
        <p className="card-text">Description: <br/>{tasks.description}</p>
        <p className="card-text">Assigned to: {assigned}</p>
      </div>
      <div className="card-footer text-muted" padding="100px">
        <p className="card-text m-1"><em>Labels: {currentLabels}</em></p>
        {update ? <div> <p className="card-text m-1"><em>Edit Labels:</em></p> <CreatableSelect isMulti defaultValue={tasks.labels !== '' ? JSON.parse(tasks.labels) : ''} onChange={(e) => handleLabels(e)} placeholder='Create a label by typing here or select a label below' options={existingLabels}/></div> : ''}
=======
      <div className="card-body" padding="100px">
        <p className="card-text"><em>{tasks.description}</em></p>
        <p className="card-text"><em>Deadline: {tasks.deadline !== 'None' ? tasks.deadline : 'No deadline'} </em></p>
        <p className="card-text"><em>Estimated completion time: {tasks.time_estimate} hours </em></p>
        <p className="card-text"><em>Task Status: {tasks.current_state}</em></p>
        <p className="card-text"><em>Labels: {currentLabels}</em></p>
        <p className="card-text"><em>Assigned to: {assigned}</em></p>
        {update ? <div> <p className="card-text"><em>Edit Labels:</em></p> <CreatableSelect isMulti defaultValue={tasks.labels !== '' ? JSON.parse(tasks.labels) : ''} onChange={(e) => handleLabels(e)} placeholder='Create a label by typing here or select a label below' options={existingLabels}/></div> : ''}
>>>>>>> main
        <br />
      </div>
    </div>
  </>
  )
}

export default TaskCard