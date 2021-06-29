import React from 'react';

const TaskCard = (props) => {
  const tasks = props.task
  return (<>
    <div className="card my-2 mx-5"> 
      <div className="card-body" padding="100px">
          <h5 className="card-title">
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
      </div>
    </div>
  </>
  )
}

export default TaskCard