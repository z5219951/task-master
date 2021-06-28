import './Padding.css'
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import store from '../store'
import axios from 'axios';

const UpdateDetail = (props) => {

  const [detail, setDetail] = useState('');
  const [detailProp, setDetailProp] = useState('');
  
  const [user, setUser] = useState({})
  // Find current user
  const currentUser = store.getState().id;
  useEffect(() => {
    axios.get('http://localhost:5000/userInform').then((res) => {
    const users = res.data
    for (let i=0; i < users.length; i++) {
      // If user ID in database matches current user
      if (String(users[i].id) === String(currentUser)) {
        console.log(users[i])
        setUser(users[i])
      }
    }
    }).then(() => {
      setDetailProp(props.detail)
    })
  },[props])

  console.log(props.detail)
  function handleSubmit (detailProp, detail) {
    console.log(detailProp, detail)
    console.log(user)
    const updateDet = {...user};
    updateDet[detailProp] = detail;
    console.log(updateDet);
    setUser(updateDet);
  }

  useEffect(() => {
    axios.put(`http://localhost:5000/userInform/1`, user)
  }, [user])
  
  return (
    <>
    <div class="padding">
      <br/>
      <div><h2>Current {props.label}: </h2> <h4>{user[detailProp]}</h4> </div>
      <br/>
      <div><h2>New {props.label}: </h2></div>
      <div class="col-md-3">
        <input class="form-control input-sm" type="text" id="name" onChange={(e) => setDetail(e.target.value)}></input>
      </div>
      <br/>
      <button type="button" class="btn btn-primary" onClick={(e) => handleSubmit(detailProp, detail)}>Submit</button>
    </div>
    </>
  )
}

export default UpdateDetail;