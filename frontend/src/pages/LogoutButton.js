import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import store from '../store';

// when use this button, you may need doing like this
// <LogoutButton history = {this.props.history}/>

class LogoutButton extends Component{
    constructor(props) {
        super(props);
    }
    handleClick = ()=>{
        // logout current account
        try {
            const email = store.getState().email;
            // give the current email address
            // attention, we didn't think about multi-login accounts
            axios.post('http://localhost:5000/logout', {email:email}).then((res)=>{
            const action = {
                type:'login_id',
                value:""
            }
            const loggedIn = {
                type:'loggedIn',
                value: false
            }
            console.log(store.getState())
            store.dispatch(action);
            store.dispatch(loggedIn)
            // after logout, it will go to home page
            this.props.history.push('./home');
            })
        } catch (error) {
          console.log(error);
        }
    }
    render(){
        return (
            <button type="button" className="btn btn-warning" onClick={this.handleClick}>Logout</button>
        )
    }
}

export default LogoutButton;