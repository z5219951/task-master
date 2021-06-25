import './Padding.css'
import './Profile.css'
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const history = useHistory();
  
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
              <td> @email.com </td>
            </tr>
            <tr>
              <th scope="row">Username</th>
              <td> abc </td>
            </tr>
            <tr>
              <th scope="row">First Name</th>
              <td> a </td>
            </tr>
            <tr>
              <th scope="row">Last Name</th>
              <td> bc </td>
            </tr>
            <tr>
              <th scope="row">Phone</th>
              <td> 0123 </td>
            </tr>
            <tr>
              <th scope="row">Company</th>
              <td> abc123 </td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile;