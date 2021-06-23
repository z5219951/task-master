import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'

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
      const testForm = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/
      if(!testForm.test(passWord)) {
        console.log("paswword fail");
        this.setState(()=>({
          passWord:'',
          passWordAlert:'Please enter correct password'
        }))
        pass = false;
      }
      const testEmail = /^[a-zA-Z0-9_-]+`@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
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
      axios.post('http://localhost:5000/login', {data:{email:this.state.email,passWord:this.state.passWord}}).then((res)=>{
          console.log("you send the login data");
          // this.setState(()=>({
          //     list:[...res.data]
          // }))
      })
    } catch (error) {
        console.log(error);
    }
  }
  render(){
    return(
    <div className="container">
      <div className="containerBox">
        <form className="form-signin">
          <p className="form-signin-heading">Please sign in</p>
          <label htmlFor="inputEmail" className="sr-only loginDes">Email address</label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" value = {this.state.email} onChange={this.handleEmail} required autoFocus/>
          <p className="alertName">{this.state.emailAlert}</p>
          <label htmlFor="inputPassword" className="sr-only loginDes">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" value = {this.state.passWord} onChange={this.handlePass} required/>
          <p className="alertName">{this.state.passWordAlert}</p>
          <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button" >Sign in</button>
        </form>
      </div>
  </div>);
  } 
}


export default Login