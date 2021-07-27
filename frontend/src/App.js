import './App.css';
import React, { useEffect, useState } from 'react';
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
import NavbarControl from './components/NavbarControl'
import store from './store';
import { connect } from 'react-redux';
import UserRequest from './pages/UserRequest';
import SearchUser from './pages/SearchUser';
import UpdateTask from './pages/UpdateTask'
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import ViewProfile from './pages/ViewProfile'
import TestPage from './pages/TestPage';
import CalendarCom from './pages/CalendarCom';
import TaskSearchResult from './pages/TaskSearchResult'
import Connections from './pages/Connections'
import CreateProject from './pages/CreateProject'
import ViewTask from './pages/ViewTask'
import ViewGroupProject from './pages/ViewGroupProject'
import UpdateProject from './pages/UpdateProject'
import ViewMyProjects from './pages/ViewMyProjects'
import ChatTest from './pages/ChatTest';

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
        <Route path='/checkCode' exact component={CheckCode} />
        <Route path='/home' exact component={Home}/>
        <Route path='/userrequest' exact component={UserRequest} />
        <Route path='/searchuser' exact component={SearchUser} />
        <Route path='/updateTask' exact component={UpdateTask} />
        <Route path='/groups' exact component={Groups} />
        <Route path='/creategroup' exact component={CreateGroup} />
        <Route path='/viewprofile' exact component={ViewProfile} />
        <Route path='/testpage' exact component={TestPage} />
        <Route path='/calendar' exact component={CalendarCom} />
        <Route path='/taskSearchResult' exact component={TaskSearchResult} />
        <Route path='/connections' exact component={Connections} />
        <Route path='/createproject' exact component={CreateProject} />
        <Route path='/viewGroupProject' exact component={ViewGroupProject} />
        <Route path='/viewTask' exact component={ViewTask} />
        <Route path='/updateProject' exact component={UpdateProject} />
        <Route path='/viewMyProjects' exact component={ViewMyProjects} />
        <Route path='/chatTest' exact component={ChatTest} />
        <Route path='/' component={Home} />
      </Switch>
    </>
  );
}

export default App;
