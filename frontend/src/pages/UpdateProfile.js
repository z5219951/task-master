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
    <h1> Update your Profile</h1> 
    <div class="mb-3 text-end">
      <button class="btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
    </div>
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