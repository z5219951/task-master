import CreateTask from './CreateTask';
import './Padding.css'
import { useHistory } from 'react-router-dom';

// get user id
import store from '../store';

const Taskboard = () => {
  const history = useHistory();
  
  // Yue just a example
  console.log(store.getState().id);

  function createTask() {
    history.push('/createTask')
  }

  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <br/>
      <div className="text-right mb-3">
        <button type="button" className="btn btn-secondary btn-lg w-100" onClick={() => { createTask()}}> Create Task </button></div>
      <br/>
        <div className="card">
          <h5 className="card-title">My Tasks:</h5>
          <br/>
        </div>
      </div>
    </>
  )
}

export default Taskboard;