import Navigation from '../components/Navigation'
import SignedInNav from '../components/SignedInNav'
import store from '../store';
import { connect } from 'react-redux';

const NavbarControl = () => {

  if (store.getState() === undefined) {
    const action = {
      type:'loggedIn',
      value: false
    }
    store.dispatch(action);
  }

  const loggedIn = store.getState().loggedIn;
  // Returns Navigation with register/login if user is not logged in 
  // Returns SignedInNav with profile/logout if user is logged in
  return (
    <>
    {loggedIn ? (<SignedInNav/>) : (<Navigation />)}
    </>
  )
} 

const mapStateToProps = (state) => {
  return { state };
};

export default connect(mapStateToProps)(NavbarControl); 