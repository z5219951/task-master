import React from 'react';

const TaskCard = (props) => {
  const tasks = props.task
  return (<>
    <div class="card my-2 mx-5"> 
      <div class="card-body" padding="100px">
        <p class="card-text">
          <h5 class="card-title">
            Task #{tasks.id}:
            <br/>
            Name: {tasks.name}
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
          Start Date: {tasks.startD}
          <br />
          Due Date: {tasks.dueD}
          <br />
          {tasks.cState}
        </p>
      </div>
    </div>
  </>
  )
}

export default TaskCard