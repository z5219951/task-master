import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import store from '../store';
import {  Nav } from 'react-bootstrap';

// when use this button, you may need doing like this
// <LogoutButton history = {this.props.history}/>

class LogoutButton extends Component{
    constructor(props) {
        super(props);
    }
    handleClick = ()=>{
        // logout current account
        try {
            const id = Number(store.getState().id);
            // give the current id address
            // attention, we didn't think about multi-login accounts
            axios.defaults.crossDomain=true;
            axios.post('http://localhost:5000/logout', {id:id}).then((res)=>{
            const action = {
                type:'login_id',
                value:""
            }
            const loggedIn = {
                type:'loggedIn',
                value: false
            }
            const deletEmail = {
                type:'reset_email',
                value: ""
            }
            const deletEmail2 = {
                type:'user_email',
                value: ""
            }
            store.dispatch(action);
            store.dispatch(loggedIn);
            store.dispatch(deletEmail);
            store.dispatch(deletEmail2);
            // after logout, it will go to home page
            this.props.history.push('./home');
            })
        } catch (error) {
          console.log(error);
        }
    }
    render(){
        return (
            <Nav className="ml-auto">
                <Nav.Link onClick={this.handleClick}>Logout</Nav.Link> 
            </Nav>
        )
    }
}

export default LogoutButton;