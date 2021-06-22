import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'

class Register extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      user:'',
      passWord:'',
      confirm:'',
      emailAlert:'',
      passWordAlert:'',
      userAlert:'',
      confirmAlert:''
    }
  }
  handleInput = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    const alert = e.target.name+'Alert';
    this.setState(()=>({
      [name]:value,
      [alert]:''
    }))
  }
  handleSubmit = ()=>{
    try {
      const state = this.state;
      const email = state.email;
      const user = state.user;
      const confirm = state.confirm;
      const passWord = state.passWord;
      let pass = true;
      // password must be number or alphabet,at least one lower case
      // one upper case, one number
      const testForm = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,16}$/
      if(!testForm.test(passWord)) {
        this.setState(()=>({
          passWord:'',
          passWordAlert:'Please enter correct Password'
        }))
        pass = false;
      }
      const testEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if(!testEmail.test(email)) {
        this.setState(()=>({
          email:'',
          emailAlert:'Please enter correct Email'
        }))
        console.log("email failed");
        pass = false;
      }
      if(user === '') {
        this.setState(()=>({
          user:'',
          userAlert:'Please enter correct User name'
        }))
        pass = false;
      }
      if(confirm !== passWord) {
        this.setState(()=>({
          confirm:'',
          confirmAlert:'Please enter same password'
        }))
        pass = false;
      }

      if(!pass) {
        return;
      }
      const data = {email:email,passWord:passWord,userName:user};
      axios.post('http://localhost:5000/userInform', data).then((res)=>{
          console.log("send inform");
          this.props.history.push('./login')
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
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" onChange={this.handleInput} name="email" value = {this.state.email} required autoFocus/>
          <p className="alertName">{this.state.emailAlert}</p>
          <label htmlFor="inputUserName" className="sr-only loginDes">User Name</label>
          <input type="text" id="inputUserName" className="form-control" placeholder="User name" onChange={this.handleInput} name="user" value = {this.state.user}required/>
          <p className="alertName">{this.state.userAlert}</p>
          <label htmlFor="inputPassword" className="sr-only loginDes">Password</label>
          <p className='tips'>password must be number or alphabet,at least one lower case one upper case, one number(6-16 length)</p>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleInput} name="passWord" value = {this.state.passWord}required/>
          <p className="alertName">{this.state.passWordAlert}</p>
          <label htmlFor="inputConfirm" className="sr-only loginDes">Confirm password</label>
          <input type="password" id="inputConfirm" className="form-control" placeholder="Confirm password" onChange={this.handleInput} value = {this.state.confirm} name="confirm" required/>
          <p className="alertName">{this.state.confirmAlert}</p>
          <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button">Submit</button>
        </form>
      </div>
  </div>);
  } 
}


export default Register