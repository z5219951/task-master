import './Padding.css'
import './Chatbot.css'
import { useHistory } from 'react-router-dom';
import store from '../store'
import axios from 'axios';
import { useState, useEffect } from 'react';
import React, { Component, Fragment} from 'react'

const Chatbot = () => {
  const history = useHistory();
  const [user, setUser] = useState({})

  // Find current user
  const currentUser = store.getState().id;
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get(`http://localhost:5000/user/${store.getState().id}`).then((res) => {
    setUser(JSON.parse(res.data))
    }).then(() => {
      // console.log(user)
    })

  },[])

  function backClick () {
    history.push('./taskboard')
  }

  function updateProfile () {
    history.push('./updateprofile')
  }

  function handleSubmit() {
    const msg = {}
    console.log(msg)
    axios.defaults.crossDomain=true;
    axios.post('http://localhost:5000/chatbot', msg).then(()=>{
      console.log("Task Created");
      history.push('./chatHistory');
    })

    }

  return (
    <>
        <form onSubmit={handleSubmit}>
          <input type="text" name="userInput"/>
        </form>
        
        <button onclick={handleSubmit}>
          Submit
        </button>
    </>
      
  )
}

export default Chatbot;