import './Padding.css'
import './Chatbot.css'
import store from '../store'
import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react'

const Chatbot = () => {
  const [user, setUser] = useState({})
  const [msg, setMsg] = useState()
  // Find current user
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get(`http://localhost:5000/user/${store.getState().id}`).then((res) => {
    setUser(JSON.parse(res.data))
    }).then(() => {
    })

  },[])

  function handleSubmit() {
    console.log(msg, user)
    axios.defaults.crossDomain=true;
    const msgNew = {"message": msg, "user":user}
    axios.post('http://localhost:5000/chatbot', msgNew).then((res)=>{
      console.log("Task Created");
      console.log(res);
    })
    
    }

  return (
    <>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={(e)=> {setMsg(e.target.value)}} name="userInput"/>
        </form>
        
        <button onClick={handleSubmit}>
          Submit
        </button>
    </>
      
  )
}

export default Chatbot;