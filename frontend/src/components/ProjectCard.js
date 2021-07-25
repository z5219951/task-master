import { useHistory } from 'react-router-dom';

const ProjectCard = (props) => {
  const project = props.project
  const history = useHistory();

  function handleView (task) {
    history.push({
      pathname: './viewTask',
      task: { task }
    })
  }

  return (
    <>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="row display-5">
          <div className="col">Project #{project.id} - {project.name}</div>
        </div>
      </div>
      <div className="card-body text-muted" padding="100px">
        <p className="card-text">Description: <br/>{project.description}</p>
        <p className="card-text">Connected Tasks: </p>
        {project.tasks.map((task, index) => {
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