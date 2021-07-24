import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import store from '../store';
import TaskCard from '../components/TaskCard'

const CreateProject = () => {
  const history = useHistory();
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameAlert, setNameAlert] = useState('')
  const [descriptionAlert, setDescriptionAlert] = useState('')
  const [createdTasks, setCreatedTasks] = useState('');
  const [assignedTasks, setAssignedTasks] = useState('');
  const [allTasks, setAllTasks] = useState('');
  const [toggleView, setToggleView] = useState(false);
  const [friends, setFriends] = useState('')
  const [userList, setUserList] = useState([])
  const [assignedTo, setAssignedTo] = useState()
  const [taskList, setTaskList] = useState([])
  const [connectedTasks, setConnectedTasks] = useState([])

  function backClick () {
    history.push('./taskboard')
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

    const project = {name: name, description: description, connected_tasks: connectedTasks, assigned_to: assignedTo, createdBy: store.getState().id}
    console.log(project)
  }

  // Get tasks created by and assigned to the logged in user
  axios.defaults.crossDomain=true;
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      setCreatedTasks(taskList)
    })

    axios.get(`http://localhost:5000/tasks/assigned/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      setAssignedTasks(taskList)
    })

    //Obtain connected users
    axios.get(`http://localhost:5000/friends/lists/${store.getState().id}`).then((res) => {
      setFriends(JSON.parse(res.data))
      setUserList(Array(JSON.parse(res.data).length).fill(false));
    })
  }, [])



  useEffect(() => {
    console.log(assignedTo)
  }, [assignedTo])

  useEffect(() => {
    console.log(connectedTasks)
  }, [connectedTasks])
  /*
  useEffect(() => {
    if (createdTasks !== '' && assignedTasks !== '') {
      const ids = new Set(createdTasks.map(d => d.id));
      setAllTasks([...createdTasks, ...assignedTasks.filter(d => !ids.has(d.id))])
    }
  },[createdTasks, assignedTasks])

  function handleToggle() {
    /*
    if (toggleView === true) {
      setToggleView(false)
    } else {
      setToggleView(true)
    }
  }
  */

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
    if (createdTasks) {
      createdTasks.map((task, index) => {
        if (taskList[index]) {
          setConnectedTasks(connectedTasks => [...connectedTasks, Number(task.id)])
        }
      })
    }
  }, [taskList])

  function handleUsers(e) {
    let newUserList = [...userList]
    if (newUserList[e.target.value]) {
      newUserList[e.target.value] = false
    } else {
      newUserList[e.target.value] = true
    }
    setUserList(newUserList)
    setAssignedTo([store.getState().id])
  }

  useEffect(() => {
    if (friends) {
      friends.map((friend, index) => {
        if (userList[index]) {
          setAssignedTo(assignedTo => [...assignedTo, friend.requestedUser])
        }
      })
    }
  }, [userList])

  return (
    <>
     <div className="padding">
      <div className="row">
        <h1 className="col">Create a Project</h1>
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
          <label htmlFor="description" className="col-sm-3 col-form-label">Tasks</label>
          <div className="col-sm-5">
            {createdTasks ? createdTasks.map((task, index) => {
              return <div key={task.id}>
                <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleTasks(e)} key={index} value={index}/>Task #{task.id} - {task.title} </h5> 
                <br/></div>
            }) : ''}   
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="description" className="col-sm-3 col-form-label">Add to Project:</label>
          <div className="col-sm-5">
            {friends ? friends.map((user, index) => {
                return <div key={index}>
                  <h5><input type="checkbox" className="form-check-input m-1" onClick={(e) => handleUsers(e)} key={index} value={index}/>{user.name} - {user.email} </h5> 
                  <br/></div>
              }) : ''} 
          </div>  
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
      </form>
    </div>
    </>
  )
}

export default CreateProject