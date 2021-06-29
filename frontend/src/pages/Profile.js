import './Padding.css'
import './Profile.css'
import { useHistory } from 'react-router-dom';
import store from '../store'
import axios from 'axios';
import { useState, useEffect } from 'react';

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState({})

  // Find current user
  const currentUser = store.getState().id;
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get('http://localhost:5000/userInform').then((res) => {
    const users = res.data
    for (let i=0; i < users.length; i++) {
      // If user ID in database matches current user
      if (String(users[i].id) === String(currentUser)) {
        setUser(users[i])
      }
    }
    }).then(() => {
      // console.log(user)
    })
  },[])

  function backClick () {
    history.push('./taskboard')
  }

  function updateProfile () {
    history.push('./updateprofile')
  }

  return (
    <>
    <div className='padding'> 
      <div class="row">
        <h1 class="col">Your Profile</h1>
        <button class="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <div  class="d-grid gap-2">
        <button type="button" class="btn btn-secondary btn-block" onClick={() => updateProfile()}> Update Profile </button>
      </div>
      <br/>
      <div>
        <div class="table table-striped table-secondary table-hover table-bordered border-dark" >    
          <tbody>
            <tr>
              <th scope="row">Email</th>
              <td> {user.email} </td>
            </tr>
            <tr>
              <th scope="row">Username</th>
              <td> {user.userName} </td>
            </tr>
            <tr>
              <th scope="row">First Name</th>
              <td> {user.firstName} </td>
            </tr>
            <tr>
              <th scope="row">Last Name</th>
              <td> {user.lastName} </td>
            </tr>
            <tr>
              <th scope="row">Phone</th>
              <td> {user.phone === '' ? 'Not entered' : user.phone} </td>
            </tr>
            <tr>
              <th scope="row">Company</th>
              <td> {user.company === '' ? 'Not entered' : user.company} </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile;