import SearchTask from '../components/SearchTask'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShowTasks from '../components/ShowTasks'

const TaskSearchResult = (props) => {

  const searchTerm = props.location.search.substring(1)
  const [empty, setEmpty] = useState('')

  const history = useHistory()
  const [searchResult, setSearchResult] = useState('')
  function backClick () {
    history.push('./taskboard')
  }

  useEffect(() => {
    /*
    axios.post('http://localhost:5000/searchTask', searchTerm, id).then((res)=> {
      setSearchResult(JSON.parse(res.data))
    })
    */
    
   setSearchResult([{'id': '1', 'owner': '2', 'title': 'abc', 'description': 'est laborum', 'creation_date': '2021-7-10', 'deadline': '2021-07-16', 'labels': 'None', 'current_state': 'In Progress', 'time_estimate': '6'}, {'id': '2', 'owner': '2', 'title': 'cde', 'description': 'efg', 'creation_date': '2021-7-10', 'deadline': '', 'labels': 'None', 'current_state': 'Blocked', 'time_estimate': '0'}])
   if (searchResult.length === 0) {
    setEmpty('No results Found')
   }

  },[])

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