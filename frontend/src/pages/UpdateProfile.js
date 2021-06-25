import './Padding.css'
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const history = useHistory();
  
  function backClick () {
    history.push('./profile')
  }

  return (
    <>
    <div className='padding'> 
      <div class="row">
          <h1 class="col">Update your Profile</h1>
          <button class="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <div class="btn-group mr-2" role="group" aria-label="Button group example">
        <button class="btn btn-primary btn-lg">Change email</button>
        <button class="btn btn-primary btn-lg">Change password</button>
        <button class="btn btn-primary btn-lg">Change username</button>
        <button class="btn btn-primary btn-lg">Change first name</button>
        <button class="btn btn-primary btn-lg">Change last name</button>
        <button class="btn btn-primary btn-lg">Change phone number</button>
        <button class="btn btn-primary btn-lg">Change company name</button>
      </div>
      <br/>
    </div>
    </>
  )
}

export default Profile;