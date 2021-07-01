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
        <Route path='/' component={Home} />
      </Switch>
    </>
  );
}

export default App;
