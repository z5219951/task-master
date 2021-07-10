const SearchTask = () => {
  return(
    <>
     <div className="input-group mb-3">
      <input type="text" placeholder="Search Task" className="form-control" aria-label="" aria-describedby="basic-addon1"></input>
      <div className="input-group-prepend">
        <button className="btn btn-outline-secondary" type="button">Search</button>
      </div>
    </div>
    </>
  )
}

export default SearchTask