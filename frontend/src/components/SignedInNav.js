import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from '../pages/LogoutButton'
import { useHistory } from 'react-router-dom';
import "./SignedInNav.css"

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
      <div className="list_box">
        <button className="btn btn-warning" onClick={() => handleProfile()}>Profile</button>
      </div>
      <div className="logout_btn">
        <LogoutButton history = {history}/>
      </div>
    </Navbar.Collapse>
  </Navbar>
    </>
  )
}

export default SignedInNav;