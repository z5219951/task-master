import './Padding.css'
import UpdateDetail from './UpdateDetail.js'
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import store from '../store';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import './Profile.css'
import { Button, Modal } from 'react-bootstrap';
import Photo from './Photo'

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState({})
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [removeNumber, setRemoveNumber] = useState(false)
  const [removeCompany, setRemoveCompany] = useState(false)
  const [removePicture, setRemovePicture] = useState(false)
  const [passwordAlert, setPasswordAlert] = useState('')
  const [show, setShow] = useState(false);
  const [newData, setNewData] = useState('')

  function backClick () {
    history.push('./profile')
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const currentUser = store.getState().id;
  useEffect(() => {
    axios.defaults.crossDomain=true;
    axios.get('http://localhost:5000/user/'+currentUser).then((res) => {
      setUser(JSON.parse(res.data))
      }).then(() => {
      })
  },[])

  useEffect(() => {

    if (newData === '') {
      return 
    }
    if (currentPassword !== '' && newPassword !== '' && confirmPassword !== '') {
      if (currentPassword !== user.password) {
        setPasswordAlert('Incorrect Current Password')
        return
      }
      if (newPassword !== confirmPassword) {
        setPasswordAlert('New password and confirm password fields do not match!')
        return
      }
      if (currentPassword === user.password && newPassword === confirmPassword) {
        const testPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,16}$/
        if (!testPass.test(newPassword)){
          setPasswordAlert('New password must be alphanumeric, have at least one lower case and upper case letter, and one number with a total length of 6-16 characters')
          return
        }
        const updateDet = {...user}; // Copy user into updateDet
        console.log(updateDet)
        updateDet.password = newPassword; // Change selected field
        setUser(updateDet); //Set user
        setPasswordAlert('')
      }
    } else if (currentPassword !== '' || newPassword !== '' || confirmPassword !== '') {
      setPasswordAlert('Please fill every password field before submitting')
      return
    }

    const updateDet = {...user}; // Copy user into updateDet

    if (firstName !== '') {
      updateDet.first_name = firstName; // Change selected field
    }

    if (lastName !== '') {
      updateDet.last_name = lastName; // Change selected field
    }
    
    if (removeNumber === true) {
      updateDet.phone_number = ''; // Change selected field
    }

    if (removeNumber === false && phoneNumber !== '') {
      updateDet.phone_number = phoneNumber; // Change selected field
    }

    if (removeCompany === true) {
      updateDet.company = ''; // Change selected field
    }

    if (removeCompany === false && companyName !== '') {
      updateDet.company = companyName; // Change selected field
    }

    if (removePicture === true) {
      updateDet.image_path = null
    }

    if(removePicture === false) {
      updateDet.image_path = newData.image_path 
    }

    console.log(updateDet)
    setUser(updateDet); //Set user
    handleShow()

  }, [newData]) 

  function getLatestDet() {
    axios.get('http://localhost:5000/user/'+currentUser).then((res) => {
      setNewData(JSON.parse(res.data))
  })
}

  function handleRemoveNumber () {
    if (removeNumber === false) {
      setRemoveNumber(true)
    } else {
      setRemoveNumber(false)
    }
  }

  function handleRemoveCompany () {
    if (removeCompany === false) {
      setRemoveCompany(true)
    } else {
      setRemoveCompany(false)
    }
  }

  function handleRemovePic () {
    if (removePicture === false) {
      setRemovePicture(true) 
    } else {
      setRemovePicture(false)
    }
 }  

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      axios.put(`http://localhost:5000/user/update `, user)
      console.log(user)
    } 
  }, [user])

  return (
    <>
    <div className='padding'> 
    <div className="row">
        <h1 className="col">Update your Profile</h1>
        <button className="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
        <h3>Please enter the fields you wish to update</h3>
      <br/>
      <div className="form">
      <div className="form-group row mb-5">
          <label htmlFor="password" className="col-sm-3 col-form-label">Update Profile Picture</label>
          <div className="col-sm-5">
            <Photo imageUrl={user.image_path}></Photo>
            <input type="checkbox" id="noPic" name="noPic" checked={removePicture} onChange={(e) => handleRemovePic()}></input>&nbsp;
            <label htmlFor="noPic"> Remove my Profile Picture</label><br></br>
          </div>
        </div>
      <div className="form-group row mb-5">
          <label htmlFor="password" className="col-sm-3 col-form-label">Update Password</label>
          <div className="col-sm-5">
            <input type="password" className="form-control" id="currentPassword" placeholder="Current Password" onChange={(e) => setCurrentPassword(e.target.value)}></input>
            <input type="password" className="form-control" id="newPassword" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)}></input>
            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}></input>
            <font color="red">{passwordAlert}</font>
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="firstName" className="col-sm-3 col-form-label">Update First Name</label>
          <div className="col-sm-5">
            <input type="text" className="form-control" id="firstName" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}></input>
            &nbsp;&nbsp;Current First Name - {user.first_name}
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="lastName" className="col-sm-3 col-form-label">Update Last Name</label>
          <div className="col-sm-5">
            <input type="text" className="form-control" id="lastName" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}></input>
            &nbsp;&nbsp;Current Last Name - {user.last_name}
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="phoneNumber" className="col-sm-3 col-form-label">Update Phone Number</label>
          <div className="col-sm-5">
          <input type="text" className="form-control" id="phoneNumber" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)}></input>
            &nbsp;&nbsp;Current Phone Number - {user.phone_number ? user.phone_number : 'Not entered'}
          </div>
          <div className="col-sm-3">
            <input type="checkbox" id="noPhone" name="noPhone" checked={removeNumber} onChange={(e) => handleRemoveNumber()}></input>&nbsp;
            <label htmlFor="noPhone"> Remove my Number</label><br></br>
          </div>
        </div>
        <div className="form-group row mb-5">
          <label htmlFor="company" className="col-sm-3 col-form-label">Update Company</label>
          <div className="col-sm-5">
            <input type="text" className="form-control" id="company" placeholder="Company"  onChange={(e) => setCompanyName(e.target.value)}></input>
            &nbsp;&nbsp;Current Company Name - {user.company ? user.company : 'Not entered'}
          </div>
          <div className="col-sm-3">
            <input type="checkbox" id="noCompany" name="noCompany" checked={removeCompany} onChange={(e) => handleRemoveCompany()}></input>&nbsp;
            <label htmlFor="noCompany"> Remove my Company</label><br></br>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => getLatestDet()}>Submit</button>
      </div>
      <Modal animation={false} show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Your Profile has been Updated!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => handleClose()} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  )
}

export default Profile;