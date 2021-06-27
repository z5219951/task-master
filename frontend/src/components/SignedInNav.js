import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from '../pages/LogoutButton'
import { useHistory } from 'react-router-dom';

const SignedInNav = () => {

  const history = useHistory();
  function handleProfile() {
    history.push('./profile')
    console.log('abc')
  }
  return(
    <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="home">ClickDown</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
    <button className="btn btn-warning" onClick={() => handleProfile()}>Profile</button>
      <LogoutButton  history = {history}/>
    </Navbar.Collapse>
  </Navbar>
    </>
  )
}

export default SignedInNav;