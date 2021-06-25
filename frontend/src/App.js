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
import CreateTask from './pages/CreateTask'
import ForgetPass from './pages/ForgetPass';
import VerifyCode from './pages/VerifyCode';
import RePassWord from './pages/RePassWord';
import CheckCode from './pages/CheckCode';

function App() {
  return (
    <>
      <SignedInNav />
      <Switch>
        <Route path='/profile' component={Profile} />
        <Route path='/updateprofile' component={UpdateProfile} />
        <Route path='/createtask' component={CreateTask} />
        <Route path='/taskboard' component={Taskboard}/>
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/forget' exact component={ForgetPass} />
        <Route path='/verify' exact component={VerifyCode} />
        <Route path='/newPass' exact component={RePassWord} />
        <Route path='/checkCode' exact component={CheckCode} />
        <Route path='/home' exact component={Taskboard}/>
      </Switch>
    </>
  );
}

export default App;
