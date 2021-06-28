import './Padding.css'
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import store from '../store'
import axios from 'axios';

const UpdateDetail = (props) => {

  const [detail, setDetail] = useState('');
  const [detailProp, setDetailProp] = useState('');
  const [updateDetAlert, setUpdateDetAlert] = useState('')
  const [user, setUser] = useState({})
  const [passwordBool, setPasswordBool] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordAlert, setPasswordAlert] = useState('');

  // Find current user
  const currentUser = store.getState().id;
  useEffect(() => {
    axios.get('http://localhost:5000/userInform').then((res) => {
    const users = res.data
    for (let i=0; i < users.length; i++) {
      // If user ID in database matches current user
      if (String(users[i].id) === String(currentUser)) {
        setUser(users[i])
      }
    }
    }).then(() => {
      setDetailProp(props.detail)
    })
  },[props])

  function verifyInfo (detailProp, detail) {
    // Handles input for email field
    setUpdateDetAlert('')
    if (detailProp === 'email') {
      const testEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
      if (!testEmail.test(detail)) {
        setUpdateDetAlert('Please enter a valid email!')
        return false;
      }
    }

    if (detailProp === 'userName') {
      if (detail === '') {
        setUpdateDetAlert('Please enter a username!')
        return false;
      }
    }

    if (detailProp === 'firstName') {
      const testWord = /^(\w+){1,30}$/
      if (detail === '') {
        setUpdateDetAlert('Please enter a valid first name!')
        return false;
      }
    }

    if (detailProp === 'lastName') {
      const testWord = /^(\w+){1,30}$/
      if (detail === '') {
        setUpdateDetAlert('Please enter a valid last name!')
        return false;
      }
    }

    return true;
  }

  function handleSubmit (detailProp, detail) {
    if (!verifyInfo(detailProp, detail)) {
      return;
    }
    const updateDet = {...user}; // Copy user into updateDet
    updateDet[detailProp] = detail; // Change selected field
    setUser(updateDet); //Set user
  }

  function handlePassword(oldPassword, newPassword, confirmPass) {
    setUpdateDetAlert('')
    console.log(user['passWord'])
    if (oldPassword !== user['passWord']) {
      setUpdateDetAlert('Current password incorrect!')
      return;
    }
    const testPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,16}$/
    if (!testPass.test(newPassword)){
      setUpdateDetAlert('Please enter a valid password')
      return;
    }

    if (newPassword !== confirmPass) {
      setUpdateDetAlert('Password and confirm password fields do not match!')
      return;
    }

    const updateDet = {...user}; // Copy user into updateDet
    updateDet['passWord'] = newPassword; // Change selected field
    setUser(updateDet); //Set user
    setPasswordAlert('Password Changed!')
  }

  // Triggered when 'user' is modified
  useEffect(() => {
    if (user !== '') {
      axios.put(`http://localhost:5000/userInform/${currentUser}`, user)
    }
  }, [user])

  useEffect(() => {
    if (detailProp === 'passWord') {
      setPasswordBool(true)
    } else {
      setPasswordBool(false)
    }
  }, [detailProp])
  
  return (
    <>
    <div class="padding">
      <br/>
      {passwordBool ? <div>
        <div><h2>Please enter your current password: </h2></div>
        <div class="col-md-3">
          <input class="form-control input-sm" type="password" id="name" onChange={(e) => setOldPassword(e.target.value)}></input>
        </div>
        <div><h2>New {props.label}: </h2></div>
        <div class="col-md-3">
          <input class="form-control input-sm" type="password" id="name" onChange={(e) => setNewPassword(e.target.value)}></input>
        </div>
        <div><h2>Confirm New {props.label}: </h2></div>
        <div class="col-md-3">
          <input class="form-control input-sm" type="password" id="name" onChange={(e) => setConfirmPass(e.target.value)}></input>
          <font color="red">{updateDetAlert}</font>
        </div>
        <br/>
        <button type="button" class="btn btn-primary" onClick={(e) => handlePassword(oldPassword, newPassword, confirmPass)}>Submit</button>
        <br />
        <font color="green">{passwordAlert}</font>
      </div> 
      
      : <div>
        <div><h2>Current {props.label}: </h2> <h4>{user[detailProp]}</h4> </div>
        <br/>
        <div><h2>New {props.label}: </h2></div>
        <div class="col-md-3">
          <input class="form-control input-sm" type="text" id="name" onChange={(e) => setDetail(e.target.value)}></input>
          <font color="red">{updateDetAlert}</font>
        </div>
        <br/>
        <button type="button" class="btn btn-primary" onClick={(e) => handleSubmit(detailProp, detail)}>Submit</button>
          </div>
      }
    </div>
    </>
  )
}

export default UpdateDetail;