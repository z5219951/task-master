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
      lastName:'',
      firstName:'',
      phone:'',
      comp:'',
      emailAlert:'',
      passWordAlert:'',
      userAlert:'',
      confirmAlert:'',
      firstNameAlert:'',
      lastNameAlert:'',
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
      const firstName = state.firstName;
      const lastName = state.lastName;
      const phone = state.phone;
      const comp = state.comp;
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
      const testWord = /^(\w+){1,30}$/
      if(!testWord.test(firstName)) {
        this.setState(()=>({
          firstName:'',
          firstNameAlert:'Please enter your first name'
        }))
        pass = false;
      }
      if(!testWord.test(lastName)) {
        this.setState(()=>({
          lastName:'',
          lastNameAlert:'Please enter your last name'
        }))
        pass = false;
      }
      if(!pass) {
        return;
      }
      const data = {email:email,password:passWord,username:user,first_name:firstName,last_name:lastName,phone_number:phone,company:comp};
      axios.defaults.crossDomain=true;
      axios.post('http://localhost:5000/register', data).then((res)=>{
          console.log(res);
          const result = true;
          if(result) {
            this.props.history.push('./CheckCode')
          } else {
            this.setState(()=>({
              email:'',
              emailAlert:'This email has been used'
            }))
          }
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
          <label htmlFor="inputEmail" className="sr-only loginDes">Email address <span className='redStar'>*</span> </label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" onChange={this.handleInput} name="email" value = {this.state.email} required autoFocus/>
          <p className="alertName">{this.state.emailAlert}</p>
          <label htmlFor="inputFirstName" className="sr-only loginDes">First Name <span className='redStar'>*</span></label>
          <input type="text" id="inputFirstName" className="form-control" placeholder="First name" onChange={this.handleInput} name="firstName" value = {this.state.firstName}required/>
          <p className="alertName">{this.state.firstNameAlert}</p>
          <label htmlFor="inputLastName" className="sr-only loginDes">Last Name <span className='redStar'>*</span></label>
          <input type="text" id="inputLastName" className="form-control" placeholder="Last name" onChange={this.handleInput} name="lastName" value = {this.state.lastName}required/>
          <p className="alertName">{this.state.lastNameAlert}</p>
          <label htmlFor="inputUserName" className="sr-only loginDes">User Name <span className='redStar'>*</span></label>
          <input type="text" id="inputUserName" className="form-control" placeholder="User name" onChange={this.handleInput} name="user" value = {this.state.user}required/>
          <p className="alertName">{this.state.userAlert}</p>
          <label htmlFor="inputPhone" className="sr-only loginDes">Phone</label>
          <input type="number" id="inputPhone" className="form-control" placeholder="Phone number" onChange={this.handleInput} name="phone" value = {this.state.phone}/>
          <label htmlFor="inputComp" className="sr-only loginDes">Company</label>
          <input type="text" id="inputComp" className="form-control" placeholder="Company" onChange={this.handleInput} name="comp" value = {this.state.comp}/>
          <label htmlFor="inputPassword" className="sr-only loginDes">Password <span className='redStar'>*</span></label>
          <p className='tips'>password must be number or alphabet,at least one lower case one upper case, one number(6-16 length)</p>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleInput} name="passWord" value = {this.state.passWord}required/>
          <p className="alertName">{this.state.passWordAlert}</p>
          <label htmlFor="inputConfirm" className="sr-only loginDes">Confirm password <span className='redStar'>*</span></label>
          <input type="password" id="inputConfirm" className="form-control" placeholder="Confirm password" onChange={this.handleInput} value = {this.state.confirm} name="confirm" required/>
          <p className="alertName">{this.state.confirmAlert}</p>
          <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button">Submit</button>
        </form>
      </div>
  </div>);
  } 
}


export default Register