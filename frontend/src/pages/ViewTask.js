import { useHistory } from 'react-router-dom';
import TaskCard from '../components/TaskCard'

const ViewTask = (props) => {
  const task = props.location.task.task
  const history = useHistory()
  console.log(props.location.task.task)
  function backClick() {
    history.goBack()
  }
  return (
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Viewing Task #{task.id} - {task.title} </h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <TaskCard task={task}></TaskCard>
    </div>
    </>
  )
}

export default ViewTask