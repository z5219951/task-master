import SearchTask from '../components/SearchTask'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShowTasks from '../components/ShowTasks'
import store from '../store';

const TaskSearchResult = (props) => {

  const searchTerm = props.location.search.substring(1)
  const [empty, setEmpty] = useState('')

  const history = useHistory()
  const [searchResult, setSearchResult] = useState('')
  function backClick () {
    history.push('./taskboard')
  }

  useEffect(() => {
    const data = {
      'searchTerm': searchTerm,
      'currentUser': store.getState().id
    }
    axios.post('http://localhost:5000/tasks/search', data).then((res)=> {
      setSearchResult(JSON.parse(res.data))
      console.log(res)
    })

  },[props.location])

  return(
    <>
    <div className="padding">
      <div className="row">
        <h1 className="col">Searching all tasks for {searchTerm}</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <SearchTask />
      <h1>{searchResult.length} results found:</h1>
      <ShowTasks key={searchResult} tasks={searchResult}/>
      {empty}
    </div>
    </>
  )
}

export default TaskSearchResult