import { Navbar, Nav } from 'react-bootstrap';
import LogoutButton from '../pages/LogoutButton'
import { useHistory } from 'react-router-dom';
import "./SignedInNav.css"
import Collaboration from '../pages/Collaboration';
import { useEffect } from 'react';
import store from '../store';
import axios from 'axios'
import { useState } from 'react';
import pic from '../blank.jpg'

const SignedInNav = () => {
  const [user, setUser] = useState('')
  const history = useHistory();
  const [photo, setPhoto] = useState('')
  useEffect(() => {
    console.log(store.getState().id)
    axios.get(`http://localhost:5000/user/${store.getState().id}`).then((res) => {
      setUser(JSON.parse(res.data))
    })
  }, [])

  useEffect(() => {
    if (user) {
     setPhoto(user.image_path)
    }
  }, [user])
  return(
    <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="taskboard">ClickDown</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <div className='sign_bar_opt'>
        <Nav className="ml-auto">
          <Nav.Link href="taskboard">Taskboard</Nav.Link>
          <Nav.Link href="calendar">Calendar</Nav.Link>
          <Nav.Link href="groups">Projects</Nav.Link>
          <Nav.Link href="chatTest">Chatbot</Nav.Link>
        </Nav>
        <Collaboration history = {history}/>
      </div>
      <div className="logout_btn">
      <Nav.Link href="profile">
        {user.image_path !== 'None' ? <img src={photo} width="30" height="30"></img> : <img src={pic} width="30" height="30"></img>} &nbsp;{user.first_name}'s Profile</Nav.Link>
        <LogoutButton history = {history}/>
      </div>
    </Navbar.Collapse>
  </Navbar>
    </>
  )
}

export default SignedInNav;