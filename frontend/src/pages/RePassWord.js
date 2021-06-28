import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';

class RePassWord extends Component{
  constructor(props) {
    super(props);
    this.state = {
      passWord:'',
      confirm:'',
      passWordAlert:'',
      confirmAlert:'',
      email:store.getState().email
    }
    // user must enter their email else go back enter
    if(this.state.email === '') {
        this.props.history.push('./forget');
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
      const confirm = this.state.confirm;
      const passWord = this.state.passWord;
      let pass = true;
      // email and password should not be empty
      const testForm = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,16}$/
      if(!testForm.test(passWord)) {
        console.log("paswword fail");
        this.setState(()=>({
          passWord:'',
          passWordAlert:'Please enter correct password'
        }))
        pass = false;
      }
      if(confirm !== passWord) {
        this.setState(()=>({
          confirm:'',
          confirmAlert:'Please enter same password'
        }));
        pass = false;
      }
      
      if (!pass) {
        return;
      }
      const email = this.state.email;
      // use axios for post data
      axios.post('http://localhost:5000/newPass', {email:email,passWord:passWord}).then((res)=>{
        const result = true;
        if(result) {
          this.props.history.push('./login');
        } else {
          this.setState(()=>({
            passWord:'',
            passWordAlert:'Please enter correct password',
            confirm:'',
            confirmAlert:''
          }))
        }
          
      })
    } catch (error) {
        console.log(error);
    }
  }
  render(){
    return(
    <Fragment>
      <div className="container">
        <div className="containerBox">
          <form className="form-signin">
            <p className="form-signin-heading">Please Enter Your New Password</p>
            <p className='tips'>password must be number or alphabet,at least one lower case one upper case, one number(6-16 length)</p>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleInput} name="passWord" value = {this.state.passWord}required/>
            <p className="alertName">{this.state.passWordAlert}</p>
            <label htmlFor="inputConfirm" className="sr-only loginDes">Confirm password</label>
            <input type="password" id="inputConfirm" className="form-control" placeholder="Confirm password" onChange={this.handleInput} value = {this.state.confirm} name="confirm" required/>
            <p className="alertName">{this.state.confirmAlert}</p>
            <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button" >Reset</button>
          </form>
        </div>
      </div>
  </Fragment>
  );
  } 
}


export default RePassWord