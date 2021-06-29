import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';

class VerifyCode extends Component{
  constructor(props) {
    super(props);
    this.state = {
      code:'',
      codeAlert:'',
      email:store.getState().email
    }
    // user must enter their email
    const email= store.getState().email;
    if(email === '') {
      this.props.history.push('./forget');
    }
  }

  // handle code status
  handleCode = (e)=>{
    this.setState(()=>({
      code:e.target.value,
      codeAlert:''
    }))
  }

  // check whether get correct code
  handleSubmit = ()=>{
    try {
      const code = this.state.code;
      if(code === '') {
        this.setState(()=>({
            code:'',
            codeAlert:'Please enter Code'
          }))
      }
      const data = {
        code:code,
        email:this.state.email
      }
      // use axios for post data
      axios.defaults.crossDomain=true;
      axios.post('http://localhost:5000/forgetCode', data).then((res)=>{
          // check the return information, if true it will enter the code page else 
          // it should request to enter again
          const result = true;
          if (result) {
            console.log("correct");
            this.props.history.push('./newPass');
          } else {
            this.setState(()=>({
                codeAlert:'Please enter correct Code'
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
            <p className="form-signin-heading">Please Enter Your Code</p>
            <label htmlFor="inputcode" className="sr-only loginDes">Verify Code</label>
            <input id="inputcode" className="form-control" placeholder="code" value = {this.state.code} onChange={this.handleCode} required autoFocus/>
            <p className="alertName">{this.state.codeAlert}</p>
            <button className="btn btn-lg btn-primary btn-block btnSign" onClick={this.handleSubmit} type="button" >Check Code</button>
          </form>
        </div>
      </div>
  </Fragment>
  );
  } 
}


export default VerifyCode