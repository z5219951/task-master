import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import store from '../store';

const CreateProject = (props) => {
  const group = props.location.state.group
  const history = useHistory();
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameAlert, setNameAlert] = useState('')
  const [descriptionAlert, setDescriptionAlert] = useState('')
  const [createdTasks, setCreatedTasks] = useState('');
  const [taskList, setTaskList] = useState([])
  const [connectedTasks, setConnectedTasks] = useState([])
  const [taskids, setTaskids] = useState()
  const [tasks, setTasks] = useState([])

  function backClick () {
    history.push('./groups')
  }

  function handleSubmit () {
    if (name === '') {
      setNameAlert('Please enter a project name!')
      return
    } else {
      setNameAlert('');
    }

    if (description === '') {
      setDescriptionAlert('Please enter a project description!')
      return
    } else {
      setDescriptionAlert('');
    }

    const project = {name: name, description: description, connected_tasks: connectedTasks, assigned_to: group.groupID, created_by: store.getState().id}
    axios.post('http://localhost:5000/projects/create', project).then((res) => {
      history.push('./groups')
    })
  }

  // Get tasks associated with users in the group
  axios.defaults.crossDomain=true;
  useEffect(() => {
    
    axios.get(`http://localhost:5000/groups/${group.groupID}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data);
      setTaskids(taskList)
    })

  }, [])

  useEffect(() => {
    setTasks([])
    if (taskids) {
      taskids.map((id) => {
        axios.get(`http://localhost:5000/tasks/${id}`).then((res) => {
          setTasks(tasks => [...tasks, JSON.parse(res.data)])
    })
      })
    }
  }, [taskids])

  function handleTasks(e) {
    let newTaskList = [...taskList]
    if (newTaskList[e.target.value]) {
      newTaskList[e.target.value] = false
    } else {
      newTaskList[e.target.value] = true
    }
    setTaskList(newTaskList)
    setConnectedTasks([])
  }

  useEffect(() => {
    if (tasks) {
      tasks.map((task, index) => {
        if (taskList[index]) {
          setConnectedTasks(connectedTasks => [...connectedTasks, Number(task.id)])
        }
      })
    }
  }, [taskList])

  function handleView (task) {
    history.push({
      pathname: './viewTask',
      task: { task }
    })
  }

  return (
    <>
     <div className="padding">
      <div className="row">
        <h1 className="col">Create a Project with {group.groupName}</h1>
        <br />
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <form>
        <div className="form-group row mb-5">
          <label htmlFor="name" className="col-sm-3 col-form-label">Project Name<span className='redStar'>*</span></label>
          <div className="col-sm-5">
            <input className="form-control input-sm" type="text" id="name" onChange={(e) => setName(e.target.value)}></input>
            <div><font color="red">{nameAlert}</font></div>
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Project Description<span className='redStar'>*</span></label>
          <div className="col-sm-5">
            <textarea className="form-control" rows="3" id="description" onChange={(e) => setDescription(e.target.value)}></textarea>
            <div><font color="red">{descriptionAlert}</font></div>
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Unassigned tasks from group members</label>
          <div className="col">
            {tasks ? tasks.map((task, index) => {
              return <div key={index}>
                <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleTasks(e)} key={index} value={index}/>{task.title} - (Task ID #{task.id}) &nbsp;
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

export default CreateProject