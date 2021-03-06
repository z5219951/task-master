import './Padding.css'
import './Profile.css'
import { useHistory } from 'react-router-dom';
import store from '../store'
import axios from 'axios';
import { useState, useEffect } from 'react';
import pic from '../blank.jpg'
import { ProgressBar } from 'react-bootstrap';

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState({})
  const [progress, setProgress] = useState('')
  const [overloaded, setOverloaded] = useState(false)
  const [variant, setVariant] = useState('')

  // Find current user
  const currentUser = store.getState().id;
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get(`http://localhost:5000/user/${store.getState().id}`).then((res) => {
      setUser(JSON.parse(res.data))
    })
  },[])

  useEffect(() => {
    if (user.email) {
      axios.get(`http://localhost:5000/busy/${user.email}`).then((res) => {
        setProgress(res.data)
        if (res.data > 99) {
          setVariant('danger')
        } else if (res.data > 64) {
          setVariant('warning')
        } else if (res.data > 24) {
          setVariant('success')
        } else {
          setVariant('info')
        }
        if (res.data > 100) {
          setOverloaded(true)
        } else {
          setOverloaded(false)
        }
      })
    }
  }, [user])

  function backClick () {
    history.push('./taskboard')
  }

  function updateProfile () {
    history.push('./updateprofile')
  }

  return (
    <>
    <div className='padding'> 
      <div className="row">
        <h1 className="col">Your Profile</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <div className="d-grid gap-2">
        <button type="button" className="btn btn-secondary btn-block" onClick={() => updateProfile()}> Update Profile </button>
      </div>
      <br/>
      <div className=" mb-5 align-items-center">
        <h3>Your Workload in the next 7 days:</h3>
        <ProgressBar variant={variant} now={progress}></ProgressBar> 
        <h5 className="text-center">{Number(progress).toFixed(0)} % Busy {overloaded ? '(Overloaded)' : ''}</h5>
      </div>
      <div>
        {user.image_path !== 'None' ? <img src={user.image_path} alt="profile" style={{width:'150px', height:'150px'}} className="rounded mx-auto d-block" /> : <img src={pic} alt="profile" style={{width:'150px', height:'150px'}} className="rounded mx-auto d-block" />} 
        <br />
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
    </div>
  </>
  )
}

export default Profile;