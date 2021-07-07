import React from 'react';
import { useHistory } from 'react-router-dom';

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
      <div className="card-body" padding="100px">
          <h5 className="card-title">
            Task #{tasks.id}:
            <br/>
            Name: {tasks.title}
            <br />
          </h5>
          Description: {tasks.description}
          <br />
          <progress value={tasks.progress} max="100"> </progress>
          <br />
          {tasks.progress} % complete
          <br />
          Difficulty: {tasks.difficulty}
          <br />
          Start Date: {tasks.creation_date}
          <br />
          Due Date: {tasks.deadline}
      </div>
      <button className="btn btn-secondary btn-lg" onClick={() => handleClick()}>Update Task</button>
    </div>
  </>
  )
}

export default TaskCard