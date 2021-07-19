import TaskCard from '../components/TaskCard'
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const ShowTasks = (props) => {

  const update = props.update;
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('')
  const [all, setAll] = useState(true)
  const completionState = [{label: 'All', value: 'All'}, {label: 'Not Started', value: 'Not Started'},{label: 'In Progress', value: 'In Progress'},{label: 'Completed', value: 'Completed'},{label: 'Blocked', value: 'Blocked'} ]
  
  function handleFilter(state) {
    if (state.value === 'All') {
      setAll(true)
    }
    if (state.value === 'Not Started') {
      setFilter(state.value)
      setAll(false)
    }
    if (state.value === 'In Progress') {
      setFilter(state.value)
      setAll(false)
    }
    if (state.value === 'Completed') {
      setFilter(state.value)
      setAll(false)
    }
    if (state.value === 'Blocked') {
      setFilter(state.value)
      setAll(false)
    }

  }
  
  useEffect(() => {
    setTasks(props.tasks)
  }, [props])
  return(
    <>
    <div className="card">
    <div className="form-group">
      <div className="col-md-6 m-3">
        <label htmlFor="assign">Filter Tasks</label>
        <Select defaultValue="All" placeholder="All" options={completionState} onChange={(e) => handleFilter(e)}/>
      </div>
    </div>
      <br/>
        {tasks && tasks.map((task) => {
          if (all) { 
            return <TaskCard key={task.id} update={update} task={task}/>
          } else if (task.current_state === filter) {
            return <TaskCard key={task.id} update={update} task={task}/>
          }
        })}
    </div>
    </>
  )
}

export default ShowTasks