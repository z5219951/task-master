import './Padding.css'
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const UpdateDetail = (props) => {

  const [name, setName] = useState('');
  function handleSubmit () {
    console.log('abc')
  }
  
  return (
    <>
    <div class="padding">
      <br/>
      <div><h1>Current {props.detail}: </h1> </div>
      <div><h1>New {props.detail}: </h1></div>
      <input class="form-control input-sm" type="text" id="name" onChange={(e) => setName(e.target.value)}></input>
      <br/>
      <button type="button" class="btn btn-primary" onClick={(e) => handleSubmit()}>Submit</button>
    </div>
    </>
  )
}

export default UpdateDetail;