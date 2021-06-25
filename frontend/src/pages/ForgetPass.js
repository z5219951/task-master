import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';

class ForgetPass extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      emailAlert:''
    }
  }

  // handle email status
  handleEmail = (e)=>{
    this.setState(()=>({
      email:e.target.value,
      emailAlert:''
    }))
  }

  // check whether get correct email
  handleSubmit = ()=>{
    try {
      const email = this.state.email;
      const testEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if(!testEmail.test(email)) {
        this.setState(()=>({
          email:'',
          emailAlert:'Please enter correct Email'
        }))
        return;
      }
      // use axios for post data
      axios.post('http://localhost:5000/forgetEmail', {email:email}).then((res)=>{
          // check the return information, if true it will enter the code page else 
          // it should request to enter again
          const result = true;
          if (result) {
            const action = {
                type:'reset_email',
                value:email
            }
            store.dispatch(action);
            this.props.history.push('./verify');
          } else {
            this.setState(()=>({
                emailAlert:'Please enter correct Email'
            }))
          }
      })
    } catch (error) {
        console.log(error);
    }
  }
  handleBack = ()=>{
    this.props.history.push('./login');
  }
  render(){
    return(
    <Fragment>
      <div className="container">
        <div className="containerBox">
          <form className="form-signin">
            <button type="button" className="btn btn-info btn-xs back" onClick={this.handleBack}>Back</button>
            <p className="form-signin-heading">Please Enter Your Email</p>
            <label htmlFor="inputEmail" className="sr-only loginDes">Email address</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" value = {this.state.email} onChange={this.handleEmail} required autoFocus/>
            <p className="alertName">{this.state.emailAlert}</p>
            <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button" >Send Code</button>
          </form>
        </div>
      </div>
  </Fragment>
  );
  } 
}


export default ForgetPass