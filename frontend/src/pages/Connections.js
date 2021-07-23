import axios from 'axios';
import store from '../store';
import React, { useEffect, useState } from 'react';
import ViewProfileButton from '../components/ViewProfileButton';

const Connections = () => {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:5000/friends/lists/${store.getState().id}`).then((res) => {
      setFriends(JSON.parse(res.data))
    })
  },[])
  return (
    <>
    <div className="padding">
      <h1>Users I am connected with:</h1>
      <br/>
      {friends.map((friend) => {
        return <div key={friend.requestedUser} className="card my-2 mx-5"> <h3 className="mx-2">{friend.name} ({friend.email}) </h3> <ViewProfileButton id={friend.requestedUser}></ViewProfileButton></div>
      })}
    </div>
    </>
  )
}

export default Connections
