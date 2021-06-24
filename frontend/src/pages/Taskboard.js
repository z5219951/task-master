import './Padding.css'

const Taskboard = () => {
  return (
    <>
    <div className='padding'> 
      <h1> Welcome to your Taskboard</h1>
      <br/>
      <div><button type="button" class="btn btn-secondary btn-lg w-100" > Create Task </button></div>
      <br/>
        <div class="card">
          <h5 class="card-title">My Tasks:</h5>
          <br/>
        </div>
      </div>
    </>
  )
}

export default Taskboard;