import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';
import { Button, Modal } from 'react-bootstrap';
import './UserRequest.css'
import ViewProfileButton from '../components/ViewProfileButton'

class SearchUser extends Component{
    constructor(props) {
        super(props);
        // get id
        const id = Number(store.getState().id);
        this.state = {
            id:id,
            email:'',
            show:false,
            list:[],
            noResult:'',
            requestUser:'',
            emailAlert:''

        }
    }
    handleShow = (e)=>{
        // send request
        const type = e.target.name;
        const requestUser = Number(e.target.value);
        console.log(requestUser);
        if(type === "profile") {
            alert("go to profile")
            // send profile user id
            const action = {
                type:'user_profile',
                value:requestUser
            }
            store.dispatch(action);
        } else {
            try {
                const userId = Number(this.state.id);
                const data = {userId:userId,requestedUser:requestUser};
                axios.defaults.crossDomain=true;
                let url = "http://localhost:5000/friends/sendRequest";
                if(store.getState().testMod) {
                    url = "http://localhost:5000/request_search_email";
                }
                axios.post(url, data).then((res)=>{
                    console.log(res);
                    const result = true;
                    if(result) {
                        this.setState(()=>({
                            inform:'Connection request sent!'
                        }))
                    } else {
                        this.setState(()=>({
                            inform:'You already have sent the connection or you already have connected with this user'
                        }))
                    }
                });
            } catch (error) {
                console.log(error)
            }
            this.setState(()=>(
                {
                    show:true
                }
            ))
        }
    }
    handleClose = ()=>{
        this.setState(()=>(
            {
                show:false
            }
        ))
    }
    handleInput = (e)=>{
        this.setState(()=>({
            email:e.target.value,
            emailAlert:''
        }))
    }
    handleSubmit = ()=>{
        try {
            const email = this.state.email.trim();
            // check format, avoid empty string
            
            if(email.length === 0) {
                this.setState(()=>({
                email:'',
                emailAlert:'Please enter correct content'
                }))
                return;
            }
            // send user email to check
            const data = {input:email}
            axios.defaults.crossDomain=true;
            let url = "http://localhost:5000/friends/searchUser"
            if(store.getState().testMod) {
                url = 'http://localhost:5000/request_search_user';
            }
            axios.post(url,data).then((res)=>{
                // store the user id in store
                console.log(res)
                // const result = JSON.parse(res.data);
                const testResult = JSON.parse(res.data);
                let warn = ''
                if(testResult.length === 0) {
                    warn = 'No result'
                }
                const requestUser = testResult.requestUser;
                this.setState(()=>({
                    list:testResult,
                    noResult:warn,
                    requestUser:requestUser
                }))
            })
        } catch (error) {
            
        }
    }
    getItem = ()=>{
        return (
            this.state.list.map((item,index)=><div key = {index}className="user_request_box">
                <p className="user_request_name">{item.username}</p>
                <div className='buttonBox'>
                    <ViewProfileButton id={item.requestUser}></ViewProfileButton>
                    <Button variant="primary" name="accept" value={item.requestUser} onClick={this.handleShow}>Request Connection</Button>
                </div>
            </div>)
        )
    }
    handleBack = ()=>{
        this.props.history.push('./taskboard');
    }
    render(){
        return (
            <Fragment>
                <div className='request_container'>
                <button type="button" className="btn btn-info btn-xs request_back" onClick={this.handleBack}>Back</button>
                    <p>Search User</p>
                    <div className='serach_box'>
                        <input type="text" id="seach_email" className="form-control seach_email" placeholder="Enter user name, name, email or phone number" onChange={this.handleInput} name="email" value = {this.state.email}/>
                        <button className="btn btn-lg btn-primary btn-block" onClick={this.handleSubmit} type="button" >Search</button>
                    </div>
                    <p className="alertName">{this.state.emailAlert}</p>
                    <div className='request_list'>
                        {this.getItem()}
                    </div>
                    <p>{this.state.noResult}</p>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header>
                    <Modal.Title>Connection Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.inform}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

export default SearchUser