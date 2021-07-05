import React, { useEffect, useState } from 'react';
import axios from 'axios';
import store from '../store';
import { useHistory } from 'react-router-dom';

const UpdateTask = (props) => {
  
  const history = useHistory();
  function backClick () {
    history.push('./taskboard')
  }
  console.log(props)
  const [task, setTask] = useState('')
  const taskID = props.location.state.id;
  useEffect(() => {
    axios.get(`http://localhost:5000/user/${store.getState().id}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data).tasks;
      console.log(taskList, taskID)
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskID) {
          console.log(taskList[i])
          setTask(taskList[i])
        }
      }
    })
  }, [])
  return(
    <>
      <div className="m-5">
      <div className="row">
        <h1 className="col">Updating Task #{task.id}: {task.title}</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
  

          Description: {task.description}
          <br />
          <progress value={task.progress} max="100"> </progress>
          <br />
          {task.progress} % complete
          <br />
          Difficulty: {task.difficulty}
          <br />
          Start Date: {task.creation_date}
          <br />
          Due Date: {task.deadline}
          </div>
    </>
  )
}

export default UpdateTask