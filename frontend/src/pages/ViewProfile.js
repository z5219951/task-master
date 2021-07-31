import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import ShowTasks from '../components/ShowTasks'
import pic from '../blank.jpg'

const ViewProfile = (props) => {
  const history = useHistory()
  const [user, setUser] = useState({})
  const [assignedTasks, setAssignedTasks] = useState('')
  const id = props.location.state.id

  function backClick () {
    history.goBack()
  }
/*
  useEffect(() => {
    setUser({'id': '1', 'username': 'abcdefgh', 'password': 'Abc123', 'email': 'abcd@gmail.com', 'first_name': 'abcd', 'last_name': 'efgh', 'phone_number': '0123', 'company': ''})
  },[])

  */
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get(`http://localhost:5000/user/${id}`).then((res) => {
    setUser(JSON.parse(res.data))
    }).then(() => {
      // console.log(user)
    })

    axios.get(`http://localhost:5000/tasks/assigned/${id}`).then((res) => {
      console.log(res)
      const taskList = JSON.parse(res.data);
      setAssignedTasks(taskList)
    })
  },[])

  return(
    <>
     <div className='padding'> 
      <div className="row">
        <h1 className="col">{user.first_name}'s Profile</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <br/>
      {user.image_path !== 'None' ? <img src={user.image_path} alt="profile" style={{width:'150px', height:'150px'}} className="rounded mx-auto d-block" /> : <img src={pic} alt="profile" style={{width:'150px', height:'150px'}} className="rounded mx-auto d-block" />} 
      <br />
      <div>
        <table className="table table-striped table-secondary table-hover table-bordered border-dark" >    
          <tbody>
            <tr>
              <th scope="row">Email</th>
              <td> {user.email} </td>
            </tr>
            <tr>
              <th scope="row">First Name</th>
              <td> {user.first_name} </td>
            </tr>
            <tr>
              <th scope="row">Last Name</th>
              <td> {user.last_name} </td>
            </tr>
            <tr>
              <th scope="row">Phone</th>
              <td> {user.phone_number === '' ? 'Not entered' : user.phone_number} </td>
            </tr>
            <tr>
              <th scope="row">Company</th>
              <td> {user.company === '' ? 'Not entered' : user.company} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-5"> 
        <h2 className="card-title">Tasks {user.first_name} is assigned to:</h2> 
        <ShowTasks key={assignedTasks} tasks={assignedTasks} update="true"/>
      </div>
    </div>
    </>
  )
}

export default ViewProfile