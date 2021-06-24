import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './components/Navigation'
import Taskboard from './pages/Taskboard'
import SignedInNav from './components/SignedInNav'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'

function App() {
  return (
    <>
      <SignedInNav />
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/profile' component={Profile} />
        <Route path='/updateprofile' component={UpdateProfile} />
        <Route path='/' component={Taskboard}/>
      </Switch>
    </>
  );
}

export default App;
