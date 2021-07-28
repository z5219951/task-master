import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard'
import ViewProfileButton from '../components/ViewProfileButton';

const ViewGroupProject = (props) => {
  const [projectID, setProjectID] = useState('')
  const [projects, setProjects] = useState('')
  const history = useHistory()
  const group = props.location.state.group
  console.log(props.location.state.group)
  useEffect(() => {
    // get group projects 
    axios.get(`http://localhost:5000/groups/${group.groupID}/projects`).then((res) => {
      setProjects(JSON.parse(res.data))
    })
  }, [])
  
  function backClick () {
    history.push('./groups')
  }

  return (
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Viewing all projects for {group.groupName}</h1>
          <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br />
      <div className="card">
      <div className="mx-2">
        <h5>Group Members:</h5>
        {group.members.map((member, index) => {
          return <div key={index} className="card-text"><li>{member.userName} - {member.email}
            &nbsp; <ViewProfileButton id={member.userId}></ViewProfileButton>
          </li></div>
        })}
        <br />
        </div>
      </div>

      <br />
      <div className="card">
        {projects.length > 0 ? 
          projects.map((project, index) => {
            return <div key={index}><ProjectCard project={project}></ProjectCard></div>
          })
        : 'No Projects Available'}
      </div>
    </div>
    </>
  )
}

export default ViewGroupProject