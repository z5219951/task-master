import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import store from '../store'
import ViewProfileButton from './ViewProfileButton';

const ProjectCard = (props) => {
  const project = props.project
  const history = useHistory();
  const [tasks, setTasks] = useState()
  const [progressVal, setProgressVal] = useState(0)
  const [group, setGroup] = useState('')

  useEffect(() => {
    setTasks([])   
    if (project.tasks) {
      JSON.parse(project.tasks).map((id) => {
        axios.get(`http://localhost:5000/tasks/${id}`).then((res) => {
          setTasks(tasks => [...tasks, JSON.parse(res.data)])
        })
      })   
    }

    axios.get(`http://localhost:5000/groups/${store.getState().id}`).then((res) => {
      const groups = JSON.parse(res.data)
      groups.map((groupLoop) => {
        if (Number(groupLoop.groupID) === Number(project.groupid)) {
          setGroup(groupLoop)
        }
      })
    })
  },[])

  useEffect(() => {
    let count = 0
    if (tasks && tasks.length > 0) {
      tasks.map((task) => {
        if (task.current_state === 'Completed') {
          count ++;
        }
      })
      setProgressVal(count/tasks.length)
    }
  }, [tasks])

  function handleView (task) {
    history.push({
      pathname: './viewTask',
      task: { task }
    })
  }

  function handleUpdate () {
    history.push({
      pathname: '/updateProject',
      state: { project }
  });
  }

  return (
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="col">{project.name}</div>
          <div className="col-md-2"><button className="btn btn-secondary btn-lg" onClick={() => handleUpdate()}>Update Project</button><br/></div>
        </div>
          <div className="card-text text-muted">Project ID: #{project.id}</div>
      </div>
      <div className="card-body text-muted" padding="100px">
        <progress value={progressVal}></progress> 
        <h5>{Number(progressVal*100).toFixed(0)} % Complete</h5>
        <p className="card-text">Description: <br/>{project.description}</p>
        <p className="card-text">Group ID #{group.groupID} - {group.groupName}: <br/>{group ? group.members.map((member) => {
          return <li>{member.userName} - {member.email} <ViewProfileButton id={member.userId}></ViewProfileButton> </li>
        }): ''}</p>
        <p className="card-text">Connected Tasks: 
        {tasks && tasks.length !== 0 ? tasks.map((task, index) => {
          return <div key={index} className="card-text">{task.title} - {task.current_state} (Task ID: #{task.id}) &nbsp;
            <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
          </div>
          }) : <div>No Tasks Connected</div>}
          </p>
      </div>
    </div>
  </>
  )
}

export default ProjectCard
/*
{project.tasks.map((task, index) => {
  return <div key={index} className="card-text">Task #{task.id}: {task.title} - {task.current_state} &nbsp;
  <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
  </div>
})}*/