import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';
import { Button, Modal } from 'react-bootstrap';
import './UserRequest.css'
import { Alert } from 'bootstrap';

class UserRequest extends Component{
    constructor(props) {
        super(props);
        // get id
        const id = Number(store.getState().id);
        this.state = {
            id:id,
            email:'',
            show:false,
            list:[],
            inform:'go to profile page',
            noResult:'',
            requestUser:''

        }
    }
    componentDidMount = ()=>{
        try {
            axios.get('http://localhost:5000/user_request_information').then((res)=>{
            // store the user id in store
            console.log(res)
            // const result = JSON.parse(res.data);
            const testResult = [
                {
                    requestUser:123,
                    userName:'test1'
                },
                {
                    requestUser:331,
                    userName:'test2'
                }
            ];
            let warn = ''
            if(testResult.length === 0) {
                warn = 'No Request'
            }
            this.setState(()=>({
                list:testResult,
                noResult:warn
            }))
        })
        } catch (error) {
            console.log(error);
        }
    }
    handleShow = (e)=>{
        const name = e.target.name;
        const requestUser = Number(e.target.value);
        if(name === 'profile') {
            console.log("go to profile page");
            this.setState(()=>({
                inform:'go to profile page',
            }))
        } else if(name === 'accept') {
            this.setState(()=>({
                inform:'Accept the connection?',
                requestUser:requestUser
            }))
        } else {
            this.setState(()=>({
                inform:'Decline the request?',
                requestUser:requestUser
            }))
        }
        this.setState(()=>(
            {
                show:true
            }
        ))
    }
    handleClose = ()=>{
        this.setState(()=>(
            {
                show:false
            }
        ))
    }
    handleAccept = ()=>{
        const id  = Number(this.state.id);
        const requestUser = Number(this.state.requestUser);
        const data = {userId:id,requestUser:requestUser}
        const inform = this.state.inform;
        let url = '';
        if(inform === 'Accept the connection?') {
            url = 'http://localhost:5000/user_request_accept'
        } else if (inform === 'Decline the request?'){
            url = 'http://localhost:5000/user_request_decline'
        } else {
            this.setState(()=>(
                {
                    show:false
                }
            ))
            return;
        }
        try {
            axios.post(url, data).then((res)=>{
            // store the user id in store
            const result = true;
            //const result = JSON.parse(res.data).id;
            if(result) {
                this.setState(()=>(
                    {
                        show:false
                    }
                ))
                // request the new state
                axios.get('http://localhost:5000/user_request_information').then((res)=>{
                // store the user id in store
                console.log(res)
                // const result = JSON.parse(res.data);
                const testResult = [
                    {
                        requestUser:123,
                        userName:'test1'
                    }
                ];
                let warn = ''
                if(testResult.length === 0) {
                    warn = 'No Request'
                }
                this.setState(()=>({
                    list:testResult,
                    noResult:warn
                }))
            })
            } else {
                Alert("Please try again")
            }
            
        })
        } catch (error) {
            
        }
    }
    getItem = ()=>{
        console.log(this.state.list);
        return (
            this.state.list.map((item,index)=><div key = {index}className="user_request_box">
                <p className="user_request_name">{item.userName}</p>
                <div className='buttonBox'>
                    <Button variant="secondary" name="profile" value={item.requestUser} onClick={this.handleShow}>View Profile</Button>
                    <Button variant="primary" name="accept" value={item.requestUser} onClick={this.handleShow}>Accept</Button>
                    <Button variant="danger" name="decline" value={item.requestUser} onClick={this.handleShow}>Decline</Button>
                </div>
            </div>)
        )
    }
    render(){
        return (
            <Fragment>
                <div className='request_container'>
                    {/* <p>Search User</p>
                    <div className='serach_box'>
                        <input type="text" id="inputFirstName" className="form-control" placeholder="User Email" onChange={this.handleInput} name="email" value = {this.state.firstName}/>
                        <button className="btn btn-lg btn-primary btn-block" onClick={this.handleSubmit} type="button" >Search</button>
                    </div> */}
                    <div className='request_list'>
                        {this.getItem()}
                    </div>
                    <p>{this.state.noResult}</p>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
                    <Modal.Title>Attention</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.inform}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleAccept}>
                        Yes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

export default UserRequest