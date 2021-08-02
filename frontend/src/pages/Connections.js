import axios from 'axios';
import store from '../store';
import React, { useEffect, useState } from 'react';
import ViewProfileButton from '../components/ViewProfileButton';

const Connections = () => {
  const [friends, setFriends] = useState([])
  const [busy, setBusy] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:5000/friends/lists/${store.getState().id}`).then((res) => {
      setFriends(JSON.parse(res.data))
    })
  },[])

  useEffect(() => {
    friends.map((friend) => {     
      axios.get(`http://localhost:5000/busy/${friend.email}`).then((res) => {
        setBusy(busy => [...busy, res.data])
      })
    })  
  }, [friends])

  return (
    <>
    <div className="padding">
      <h1>Users I am connected with:</h1>
      <br/>
      {friends.map((friend, index) => {
        return <div key={friend.requestedUser} className="card m-4"> <h3 className="m-2">{friend.name} ({friend.email}) - {busy[index]}% Workload {busy[index] > 99 ? '(User Overloaded)' : ''}</h3> <br/> <ViewProfileButton id={friend.requestedUser}></ViewProfileButton></div>
      })}
    </div>
    </>
  )
}

export default Connections
