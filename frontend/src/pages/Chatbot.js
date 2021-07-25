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

  return (
    <>

    <div>
        <iframe
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/2748e451-5218-4df6-baa0-96f1d1ee14fa">
        </iframe>
    </div>
   

   
  </>
  )
}

export default Chatbot;