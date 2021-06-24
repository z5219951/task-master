import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'


class CheckCode extends Component{
  constructor(props) {
    super(props);
    
  }
  handleBack = ()=>{
    this.props.history.push('./login');
  }
  render(){
      return(
          <Fragment>
              <div className='checkCode_box'>
                <p>Please check your email box and active you account</p>
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={this.handleBack}>Home Page</button>
              </div>
          </Fragment>
      )
  }
}


export default CheckCode