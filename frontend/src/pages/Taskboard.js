import CreateTask from './CreateTask';
import './Padding.css'
import { useHistory } from 'react-router-dom';

const Taskboard = () => {
  const history = useHistory();

  function createTask() {
    history.push('/createTask')
  }

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <br/>
      <div class="text-right mb-3">
        <button type="button" class="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <div class="card">
          <h5 class="card-title">My Tasks:</h5>
          <br/>
        </div>
      </div>
    </>
  )
}

export default Taskboard;