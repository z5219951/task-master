import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';
import LogoutButton from './LogoutButton';

class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      passWord:'',
      emailAlert:'',
      passWordAlert:'',
    }
  }
  handleEmail = (e)=>{
    this.setState(()=>({
      email:e.target.value,
      emailAlert:''
    }))
  }
  handlePass = (e)=>{
    this.setState(()=>({
      passWord:e.target.value,
      passWordAlert:''
    }))
  }
  handleSubmit = ()=>{
    try {
      const email = this.state.email;
      const passWord = this.state.passWord;
      let pass = true;

      // email and password should not be empty
      // check password format
      const testForm = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/
      if(!testForm.test(passWord)) {
        console.log("paswword fail");
        this.setState(()=>({
          passWord:'',
          passWordAlert:'Please enter correct password'
        }))
        pass = false;
      }

      // check email format
      const testEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if(!testEmail.test(email)) {
        console.log("email failed");
        this.setState(()=>({
          email:'',
          emailAlert:'Please enter correct Email'
        }))
        pass = false;
      }
      if (!pass) {
        return;
      }
      // use axios for post data
      axios.post('http://localhost:5000/login', {email:this.state.email,passWord:this.state.passWord}).then((res)=>{
          console.log("you send the login data");
          // store the user id in store
          const action = {
            type:'login_id',
            value:"test"
          }
          store.dispatch(action);
          // move to task board
          this.props.history.push('./taskboard');
      })
    } catch (error) {
        console.log(error);
    }
  }
  handleFor = ()=>{
    this.props.history.push('./forget');
  }
  handleReg = ()=>{
    this.props.history.push('./register');
  }
  handleBack = ()=>{
    this.props.history.push('./home');
  }
  render(){
    return(
    <Fragment>
      <div className="container">
        <div className="containerBox">
          <form className="form-signin">
          <button type="button" className="btn btn-info btn-xs back" onClick={this.handleBack}>Back</button>
            <p className="form-signin-heading">Please sign in</p>
            <label htmlFor="inputEmail" className="sr-only loginDes">Email address</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" value = {this.state.email} onChange={this.handleEmail} required autoFocus/>
            <p className="alertName">{this.state.emailAlert}</p>
            <label htmlFor="inputPassword" className="sr-only loginDes">Password</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" value = {this.state.passWord} onChange={this.handlePass} required/>
            <p className="alertName">{this.state.passWordAlert}</p>
            <div className='login_text'>
              <p className='handMouse' onClick={this.handleReg}>Register</p>
              <p className='handMouse' onClick={this.handleFor}>Forget Password</p>
            </div>
            <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button" >Sign in</button>
          </form>
        </div>
      </div>
  </Fragment>
  );
  } 
}


export default Login