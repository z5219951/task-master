import Navigation from '../components/Navigation'
import SignedInNav from '../components/SignedInNav'

const NavbarControl = (props) => {
  const loggedIn = props.loggedIn;
  console.log(loggedIn)
  // Returns Navigation with register/login if user is not logged in 
  // Returns SignedInNav with profile/logout if user is logged in
  return (
    <>
    {loggedIn ? (<SignedInNav/>) : (<Navigation />)}
    </>
  )
} 

export default NavbarControl