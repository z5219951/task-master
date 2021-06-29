import './Padding.css'
import UpdateDetail from './UpdateDetail.js'
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const history = useHistory();
  const [showDetail, setShowDetail] = useState(false)
  const [detailProp, setDetailProp] = useState('')
  const [labelProp, setLabelProp] = useState('')
  
  function backClick () {
    history.push('./profile')
  }

  function handleChange (detail, label) {
    setShowDetail(true)
    setDetailProp(detail)
    setLabelProp(label)
  }

  return (
    <>
    <div className='padding'> 
      <div class="row">
          <h1 class="col">Update your Profile</h1>
          <button class="col-md-2 btn btn-secondary btn-lg" onClick={() => backClick()}>Back</button>
      </div>
      <br/>
      <div class="btn-group mr-2" role="group" aria-label="Button group example">
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('email', 'Email')}>Change email</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('password', 'Password')}>Change password</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('username', 'Username')}>Change username</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('first_name', 'First Name')}>Change first name</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('last_name', 'Last Name')}>Change last name</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('phone_number', 'Phone Number')}>Change phone number</button>
        <button class="btn btn-primary btn-lg" onClick={() => handleChange('company', 'Company Name')}>Change company name</button>
      </div>
      <br/>
      { showDetail ? <UpdateDetail detail={detailProp} label={labelProp}/>: null}
    </div>
    </>
  )
}

export default Profile;