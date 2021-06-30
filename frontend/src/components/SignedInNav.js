import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from '../pages/LogoutButton'
import { useHistory } from 'react-router-dom';
import "./SignedInNav.css"
import Collaboration from '../pages/Collaboration';

const SignedInNav = () => {

  const history = useHistory();

  return(
    <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="home">ClickDown</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <div className='sign_bar_opt'>
        <Nav className="ml-auto">
          <Nav.Link href="profile">Profile</Nav.Link>
        </Nav>
        <Collaboration history = {history}/>
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