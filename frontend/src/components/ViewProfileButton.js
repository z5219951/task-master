import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ViewProfile from '../pages/ViewProfile'

const ViewProfileButton = (props) => {
  const history = useHistory();

  function handleClick() {
    console.log(props.id)
    history.push({
      pathname: '/viewprofile',
      state: { id: props.id }
    });  
  }

  return(
    <>
    <Button variant="secondary" name="profile" onClick={() => handleClick()}>View Profile</Button>
    </>
  )
}

export default ViewProfileButton