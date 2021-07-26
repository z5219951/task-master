import { useHistory } from 'react-router-dom';

const ProjectCard = (props) => {
  const project = props.project
  const history = useHistory();
  const tasks = [{"id":"1","owner":"2","title":"task 1","description":"abc","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"},
  {"id":"2","owner":"2","title":"task 2 ","description":"def","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"},
  {"id":"3","owner":"2","title":"task 3","description":"ghi","creation_date":"2021-7-25","deadline":"None","labels":"","current_state":"Not Started","time_estimate":"0","assigned_to":"2","file_paths":"None"}]
  

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
          <div className="col">Project #{project.id} - {project.name}</div>
          <div className="col-md-2"><button className="btn btn-secondary btn-lg" onClick={() => handleUpdate()}>Update Project</button><br/></div>
        </div>
      </div>
      <div className="card-body text-muted" padding="100px">
        <p className="card-text">Description: <br/>{project.description}</p>
        <p className="card-text">Connected Tasks: </p>
        {tasks.map((task, index) => {
          return <div key={index} className="card-text">Task #{task.id}: {task.title} - {task.current_state} &nbsp;
            <button className="col-md-2 btn btn-secondary btn-sm" onClick={() => handleView(task)}>View Task</button>
          </div>
          })}
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