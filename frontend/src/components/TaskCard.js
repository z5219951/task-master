import React from 'react';
import { useHistory } from 'react-router-dom';
import './TaskCard.css'

const TaskCard = (props) => {
  const tasks = props.task
  const history = useHistory();

  function handleClick() {
    history.push({
      pathname: '/updateTask',
      state: { id: tasks.id }
  });
  }

  return (<>
    <div className="card my-2 mx-5"> 
      <div className="card-header">
        <div className="display-5">
          Task #{tasks.id}: {tasks.title}
        </div>
      </div>
      <div className="card-body" padding="100px">
        <p className="card-text"><em>{tasks.description}</em></p>
        <p className="card-text"><em>Deadline: {tasks.deadline ? tasks.deadline : 'No deadline'} </em></p>
        <p className="card-text"><em>Estimated completion time: {tasks.time_estimate} hours </em></p>
        <p className="card-text"><em>Task Status: {tasks.current_state}</em></p>
        <button className="btn btn-secondary btn-lg" onClick={() => handleClick()}>Update Task</button>
        <br />
      </div>
    </div>
  </>
  )
}

export default TaskCard