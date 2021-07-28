import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import store from '../store';
import './TaskCard.css'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios'
import UploadFile from '../pages/UploadFile'

const TaskCard = (props) => {
  const tasks = props.task
  const [update, setUpdate] = useState(false)
  const history = useHistory();
  const [currentLabels, setCurrentLabels] = useState([])
  const [existingLabels, setExistingLabels] = useState('')
  const [formattedLabels, setFormattedLabels] = useState('')
  const [updateLabel, setUpdateLabel] = useState(false)
  const [assigned, setAssigned] = useState('')
  const [filepath, setFilePath] = useState(tasks.file_paths)

  function handleClick() {
    history.push({
      pathname: '/updateTask',
      state: { id: tasks.id }
  });
  }

  useEffect(() => {
 
     handleExistingLabels()
    
     // Find user assigned to task
     if (tasks.assigned_to !== '' || tasks.assigned_to !== undefined) {
      axios.get(`http://localhost:5000/user/${tasks.assigned_to}`).then((res) => {
      setAssigned(JSON.parse(res.data).email)
      })
    }

    // If the task is owned by or assigned to the user, the update button is visible
    if (parseInt(tasks.owner) === parseInt(store.getState().id)) {
      setUpdate(true)
    } else if (parseInt(tasks.assigned_to) === parseInt(store.getState().id)) {
      setUpdate(true)
    }
  },[])

  useEffect(() => {
    
    // Set Labels field
    if (tasks.labels !== '') {
      setCurrentLabels([])
      JSON.parse(tasks.labels).map((label) => {
        setCurrentLabels(currentLabels => [...currentLabels, ' ',label.value])
      })
    } else {
      setCurrentLabels('None')
    }
  },[updateLabel])

  function handleLabels(labels) {
    tasks.labels = JSON.stringify(labels)
    axios.put(`http://localhost:5000/tasks/update `, tasks)

    // Trigger updateLabel useEffect
    if (updateLabel) {
      setUpdateLabel(false)
    } else {
      setUpdateLabel(true)
    }

    // Post new labels when they are changed
    if (labels !== []) {
      labels.map((label) => {
        if (existingLabels.includes(label.value) === false) {
          const data = {'labels': JSON.stringify(label.value)}
          axios.post(`http://localhost:5000/labels/${store.getState().id}`, data)
          setExistingLabels(existingLabels => [...existingLabels, label.value])
        }
      })
    }
  }

  // Obtains existing labels from server
  function handleExistingLabels() {
    setExistingLabels('')
    axios.get(`http://localhost:5000/labels/${store.getState().id}`).then((res) => {
      if (res.data !== 'null') {
        const temp = JSON.parse(res.data).replace(/['"]+/g, '').split(', ')
        setExistingLabels(temp)
      }
    })
  }

  // Set Formatted Labels
  useEffect(()=> {
    setFormattedLabels('')
    if (existingLabels.length !== 0) {
      existingLabels.map((label) => {
        const data = ({label: label, value: label})
        setFormattedLabels(formattedLabels=>[...formattedLabels, data])
      })
    }
  }, [existingLabels])

  useEffect(() => {
    setFilePath(tasks.file_paths)
  }, [tasks])

  return (<>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="col">{tasks.title}</div>
          {update ? <div className="col-md-2"><button className="btn btn-secondary btn-lg" onClick={() => handleClick()}>Update Task</button><br/></div> : ''}
          <p className="card-text m-1">Task Status: {tasks.current_state}</p>
          <p className="card-text col m-1"><em>Deadline: {tasks.deadline !== 'None' ? tasks.deadline : 'No deadline'} </em></p>
          <p className="card-text col m-1">Estimated completion time: {tasks.time_estimate} hours</p>
        </div>
      </div>
      <div className="card-body text-muted" padding="100px">
        <p className="card-text">Description: <br/>{tasks.description}</p>
        <p className="card-text">Assigned to: {assigned}</p>
      </div>
      <div className="card-footer text-muted" padding="100px">
        <p className="card-text m-1"><em>Labels: {currentLabels}</em></p>
        {update ? <div> <p className="card-text m-1"><em>Edit Labels:</em></p> <CreatableSelect isMulti defaultValue={tasks.labels !== '' ? JSON.parse(tasks.labels) : ''} onChange={(e) => handleLabels(e)} placeholder='Create a label by typing here or select a label below' options={formattedLabels}/></div> : ''}
        {filepath !== undefined && filepath !== 'None' ? 
          <div><br />Files: <br />
          {JSON.parse(filepath.replace(/'/g,'"')).map((file, index) => {
          return <div key={index}> <a href={file} download>{file.substring(file.lastIndexOf('/') +1)}<br /></a> </div>
        })}
        </div>: ''}
        <br />
        {update ? <div>
        Upload Files:
        <br/>
        <UploadFile taskId={tasks.id} ></UploadFile>
        <br />
        Please refresh after upload to view changes
        </div>
        : ''}
      </div>
    </div>
  </>
  )
}

export default TaskCard