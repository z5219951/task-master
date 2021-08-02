import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SearchTask = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory();
  const [alert, setAlert] = useState('')

  function backClick () {
    history.push('./taskboard')
  }

  function handleSearch() {
    if (searchTerm === '') {
      setAlert('Please enter a search term')
      return
    } else {
      setAlert('')
    }
    history.push({
      pathname: './taskSearchResult',
      search: searchTerm
    })
  }

  return(
    <>
    <font color="red">{alert}</font> 
    <div className="input-group mb-3">
      <input type="text" placeholder="Search tasks by ID, label, name, description or deadline (YYYY-MM-DD). You many use 'AND' and 'NOT' for refinement." onChange={(e) => setSearchTerm(e.target.value)} className="form-control" aria-label="" aria-describedby="basic-addon1"></input>
      <div className="input-group-prepend">
        <button className="btn btn-outline-secondary" type="button" onClick={() => handleSearch()}>Search</button>
      </div>
    </div>
    </>
  )
}

export default SearchTask