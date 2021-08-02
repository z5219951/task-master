import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Taskboard from './pages/Taskboard'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'
import CreateTask from './pages/CreateTask'
import ForgetPass from './pages/ForgetPass';
import VerifyCode from './pages/VerifyCode';
import RePassWord from './pages/RePassWord';
import NavbarControl from './components/NavbarControl'
import UserRequest from './pages/UserRequest';
import SearchUser from './pages/SearchUser';
import UpdateTask from './pages/UpdateTask'
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import ViewProfile from './pages/ViewProfile'
import CalendarCom from './pages/CalendarCom';
import TaskSearchResult from './pages/TaskSearchResult'
import Connections from './pages/Connections'
import CreateProject from './pages/CreateProject'
import ViewTask from './pages/ViewTask'
import Chatbot from './pages/Chatbot';
import ViewGroupProject from './pages/ViewGroupProject'
import UpdateProject from './pages/UpdateProject'
import ViewMyProjects from './pages/ViewMyProjects'
import ChatTest from './pages/ChatTest';
import Rollback from './pages/Rollback';

function App() {

  return (
    <>
      <NavbarControl/>
      <Switch>
        <Route path='/profile' exact component={Profile} />
        <Route path='/updateprofile' exact component={UpdateProfile} />
        <Route path='/createtask' exact component={CreateTask} />
        <Route path='/taskboard' exact component={Taskboard}/>
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/forget' exact component={ForgetPass} />
        <Route path='/verify' exact component={VerifyCode} />
        <Route path='/newPass' exact component={RePassWord} />
        <Route path='/home' exact component={Home}/>
        <Route path='/userrequest' exact component={UserRequest} />
        <Route path='/searchuser' exact component={SearchUser} />
        <Route path='/updateTask' exact component={UpdateTask} />
        <Route path='/groups' exact component={Groups} />
        <Route path='/creategroup' exact component={CreateGroup} />
        <Route path='/viewprofile' exact component={ViewProfile} />
        <Route path='/calendar' exact component={CalendarCom} />
        <Route path='/taskSearchResult' exact component={TaskSearchResult} />
        <Route path='/connections' exact component={Connections} />
        <Route path='/createproject' exact component={CreateProject} />
        <Route path='/viewGroupProject' exact component={ViewGroupProject} />
        <Route path='/viewTask' exact component={ViewTask} />
        <Route path='/chatbot' exact component={Chatbot} />
        <Route path='/updateProject' exact component={UpdateProject} />
        <Route path='/viewMyProjects' exact component={ViewMyProjects} />
        <Route path='/chatTest' exact component={ChatTest} />
        <Route path='/rollback' exact component={Rollback} />
        <Route path='/' component={Home} />
      </Switch>
    </>
  );
}

export default App;
