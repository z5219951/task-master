import { Navbar, Nav } from 'react-bootstrap';

const Navigation = () => {
  return(
    <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="home">ClickDown</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link href="login">Login</Nav.Link>
        <Nav.Link href="register">Register</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
    </>
  )
}

export default Navigation;