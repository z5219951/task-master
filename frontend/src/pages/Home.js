import React, { Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Home.css'
import homeImage1 from '../components/images/home_1.png'
import homeImage2 from '../components/images/home_2.png'
import homeImage3 from '../components/images/home_3.png'

class Home extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <Fragment>
        <div className="home_container">
            <div className="home_content_box">
              <div className="text_container">
                <h2 className="home_title">The #1 software development tool used by agile teams</h2>
              </div>
              <div className="image_box">
                <img src={homeImage1} className="imgHome"></img>
              </div>
            </div>
            <div className="home_content_box home_content_box_center">
              <div className="text_container text_container2">
                <h2 className="home_title2">The best software teams ship early and often.</h2>
                <p className="home_title3">This App is built for every member of your software team to plan,</p>
                <p className="home_title3">track, and release great software.</p>
              </div>
            </div>
            <div className="home_content_box">
              <div className="image_box">
                <img src={homeImage2} className="imgHome"></img>
              </div>
              <div className="text_container">
                <h2 className="home_title">Create the task and manage it</h2>
              </div>
            </div>
            <div className="home_content_box">
              <div className="text_container">
                <h2 className="home_title">Find your teammates and work with them</h2>
              </div>
              <div className="image_box">
                <img src={homeImage3} className="imgHome"></img>
              </div>
            </div>
            <div className="home_content_box home_content_box_center">
              <div className="text_container text_container2">
                <h2 className="home_title2">Contact Us</h2>
                <div className="contact_details">
                  <div className="contact_box">
                    <p>Nicholai Rank</p>
                    <p className="emailColor">z5115301@unsw.edu.au</p>
                  </div>
                  <div className="contact_box">
                    <p>Gavin Wang</p>
                    <p className="emailColor">z5206647@student.unsw.edu.au</p>
                  </div>
                  <div className="contact_box">
                    <p>Justin Pham</p>
                    <p className="emailColor">z5075823@student.unsw.edu.au</p>
                  </div>
                  <div className="contact_box">
                    <p>Ka Wayne Ho</p>
                    <p className="emailColor">z5139681@student.unsw.edu.au</p>
                  </div>
                  <div className="contact_box">
                    <p>Yue Qi</p>
                    <p className="emailColor">z5219951@student.unsw.edu.au</p>
                  </div>
                </div>
                
              </div>
            </div>
        </div>
      </Fragment>
    )
  }

}

export default Home;