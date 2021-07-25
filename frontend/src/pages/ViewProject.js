import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard'

const ViewProject = (props) => {
  const [projects, setProjects] = useState('')
  const history = useHistory()
  const group = props.location.state.group
  console.log(props.location.state.group)
  useEffect(() => {
    // get group projects 
    setProjects([{"id": "1", "name":"DEF","description":"GHI","tasks":[{"id":"1","owner":"2","title":"abc","description":"def","creation_date":"2021-7-22","deadline":"2021-07-29","labels":"","current_state":"In Progress","time_estimate":"0","assigned_to":"1","file_paths":"['http://localhost:5000/uploads/tasks/1/tasks.drawio']"},{"id":"3","owner":"2","title":"123","description":"234","creation_date":"2021-7-24","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"}],"assigned_to":3,"createdBy":2},
    {"id": "2", "name":"ABC","description":"DEF","tasks":[{"id":"1","owner":"2","title":"abc","description":"def","creation_date":"2021-7-22","deadline":"2021-07-29","labels":"","current_state":"In Progress","time_estimate":"0","assigned_to":"1","file_paths":"['http://localhost:5000/uploads/tasks/1/tasks.drawio']"},{"id":"3","owner":"2","title":"123","description":"234","creation_date":"2021-7-24","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"}],"assigned_to":3,"createdBy":2}])
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
          return <div key={index} className="card-text"><li>{member.userName}</li></div>
        })}
        </div>
      </div>

      <br />
      <div className="card">
        {projects ? 
          projects.map((project, index) => {
            return <div key={index}><ProjectCard project={project}></ProjectCard></div>
          })
        : 'No Projects Available'}
      </div>
    </div>
    </>
  )
}

export default ViewProject