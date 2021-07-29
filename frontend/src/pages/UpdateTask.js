import React, { useEffect, useState } from 'react';
import axios from 'axios';
import store from '../store';
import { useHistory } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import Slider from '@material-ui/core/Slider';

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
  const [startDAlert, setStartDAlert] = useState('')
  const [dueDAlert, setDueDAlert] = useState('')
  const [timeEst, setTimeEst] = useState('')
  const [show, setShow] = useState(false);
  const [labels, setLabels] = useState('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [friends, setFriends] = useState([{label: 'Myself', value:store.getState().id}])
  const [assigned_to, setAssigned_to] = useState('')
  const [assigned, setAssigned] = useState('')
  const [noDeadline, setNoDeadline] = useState(false)
  const [timeTaken, setTimeTaken] = useState('')
  const [completionValue, setCompletionValue] = useState('')

  // Get task
  const [task, setTask] = useState('')
  const taskID = props.location.state.id;
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks/created/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskID) {
          setTask(taskList[i])
        }
      }
    })

    axios.get(`http://localhost:5000/tasks/assigned/${store.getState().id}`).then((res) => {
      const taskList = JSON.parse(res.data);
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskID) {
          setTask(taskList[i])
        }
      }
    })

   //Obtain connected users
   axios.get('http://localhost:5000/friends/lists/'+store.getState().id).then((res) => {
    const temp = JSON.parse(res.data)
    temp.map((user) => {
      setFriends(friends => [...friends,{'value': user.requestedUser, 'label': user.email}])
    })
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

    if (timeTaken !== '') {
      updateTask.time_taken = timeTaken;
    }

    if (cState) {
      updateTask.current_state = cState;
    }

    if (assigned_to !== '') {
      updateTask.assigned_to = assigned_to;
    }

    if (noDeadline === false && dueD !== '') {
      updateTask.deadline = dueD;
    }

    if (noDeadline === true) {
      updateTask.deadline = 'None'
    }
    console.log(updateTask)
    setTask(updateTask)
    handleShow()
    setStartDAlert('')
    setDueDAlert('')
  }

  useEffect(() => {
    if (Object.keys(task).length !== 0) {
      axios.put(`http://localhost:5000/tasks/update `, task)
      
      if (task.assigned_to !== '' || task.assigned_to !== undefined) {
        axios.get(`http://localhost:5000/user/${task.assigned_to}`).then((res) => {
        setAssigned(JSON.parse(res.data).email)
      })}
    } 

  },[task])

  function handleAssigned(assigned) {
    console.log(assigned)
    setAssigned_to(assigned.value)
    if (assigned.value === '') {
      setAssigned_to(store.getState().id)
    }
  }

  function handleRemoveDeadline () {
    if (noDeadline === false) {
      setNoDeadline(true)
    } else {
      setNoDeadline(false)
    }
  }

  const marks = [
    { 
      value: 0,
      label: '',
    },
    {
      value: 25,
      label: 'Blocked',
    },
    {
      value: 50,
      label: 'Not Started',
    },
    {
      value: 75,
      label: 'In Progress',
    },
    {
      value: 100,
      label: 'Completed',
    },
  ];

  const handleStatusChange = (event, newValue) => {
    console.log(newValue)
    if (newValue === 25) {
      setCState('Blocked')
    } else if (newValue === 50) {
      setCState('Not Started')
    } else if (newValue === 75) {
      setCState('In Progress') 
    } else if (newValue === 100) {
      setCState('Completed')
    }
  }

  function rollBack() {
    history.push({
      pathname: './rollback',
      state: {task}
    })
  }

  return(
    <>
      <div className="m-5">
      <div className="row">
        <h1 className="col">Updating Task: {task.title}</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <button className="col-md-5 btn btn-success btn-lg" onClick={() => rollBack()}>Rollback to a previous version</button>
      <h3>Please enter the fields you wish to update</h3>
      <br/>
      <div className="form-group row mb-5">
        <label htmlFor="cState" className="col-sm-3 col-form-label">Update Completion State</label>
        <div className="col-sm-5">
          <Slider
          defaultValue={0}
          aria-labelledby="discrete-slider-custom"
          step={null}
          marks={marks}
          onChangeCommitted={handleStatusChange}
        />
          &nbsp;&nbsp;Current Completion State - {task.current_state}
        </div>
      </div>
      <div className="form">
        <div className="form-group row mb-5">
          <label htmlFor="assign" className="col-sm-3 col-form-label">Assign Task</label>
          <div className="col-md-6">
            <Select placeholder='Search for a user to assign this task to' options={friends} onChange={(e) => handleAssigned(e)}/>
            Currently assigned to - {assigned}
          </div>
        </div>
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
            &nbsp;&nbsp;Current Deadline - {task.deadline !== 'None' ? task.deadline : 'No deadline'} 
            <br/>
            <font color="red">{dueDAlert}</font>
          </div>
            <div className="col-sm-3">
            <input type="checkbox" id="noDeadline" name="noDeadline" checked={noDeadline} onChange={(e) => handleRemoveDeadline()}></input>&nbsp;
            <label htmlFor="noDeadline"> Remove deadline</label><br></br>
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
          <label htmlFor="description" className="col-sm-3 col-form-label">Update Time Taken to Complete (Number of Hours)</label>
          <div className="col-sm-4">
            <input className="form-control input-lg" type="number" min="0" onChange={(e) => setTimeTaken(e.target.value)} ></input>
            &nbsp;&nbsp;Current Time Taken to Complete - {task.time_taken} hours
          </div>
        </div>
        <br/>
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