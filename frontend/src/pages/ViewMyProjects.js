import store from '../store';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard'
import { useHistory } from 'react-router-dom';

const ViewMyProjects = () => {
  const [projects, setProjects] = useState()
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${store.getState().id}/projects`).then((res) => {
      console.log(JSON.parse(res.data))
      setProjects(JSON.parse(res.data))
    })
  }, [])

  function backClick() {
    history.push('./taskboard')
  }

  return(
    <>
    <div className="padding">
      <div className="row">
          <h1 className="col">Your Projects: </h1>
          <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br />
      {projects ? projects.map((project, index) => {
        return <div key={index}><ProjectCard project={project}></ProjectCard></div>
      }) : ''}
    </div>
    </>
  )
}

export default ViewMyProjects