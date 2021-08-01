import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';
import { Button, Modal } from 'react-bootstrap';
import './UserRequest.css'
import ViewProfileButton from '../components/ViewProfileButton';

class UserRequest extends Component{
    constructor(props) {
        super(props);
        if (store.getState() === undefined || store.getState().id === "") {
            this.props.history.push('/home')
        }
        // get id
        const id = Number(store.getState().id);
        this.state = {
            id:id,
            email:store.getState().userEmail,
            show:false,
            list:[],
            inform:'go to profile page',
            noResult:'',
            requestUser:''

        }
        // check login status
    }
    componentDidMount = ()=>{
        try {
            let url = 'http://localhost:5000/friends/'+this.state.email+'/requests';
            if(store.getState().testMod) {
                url = 'http://localhost:5000/user_request_information';
            }
            axios.defaults.crossDomain=true;
            axios.get(url).then((res)=>{
            // store the user id in store
            console.log(res)
            // const result = JSON.parse(res.data);
            const testResult = res.data;
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
            // send profile user id
            const action = {
                type:'user_profile',
                value:requestUser
            }
            store.dispatch(action);
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
        const data = {userId:id,requestedUser:requestUser}
        const inform = this.state.inform;
        let url = '';
        if(inform === 'Accept the connection?') {
            url = 'http://localhost:5000/friends/accept'
        } else if (inform === 'Decline the request?'){
            url = 'http://localhost:5000/friends/decline'
        } else {
            this.setState(()=>(
                {
                    show:false
                }
            ))
            return;
        }
        try {
            axios.defaults.crossDomain=true;
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
                let url = 'http://localhost:5000/friends/'+this.state.email+'/requests';
                if(store.getState().testMod) {
                    url = 'http://localhost:5000/user_request_information';
                }
                axios.get(url).then((res)=>{
                // store the user id in store
                console.log(res)
                // const result = JSON.parse(res.data);
                const testResult = res.data
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
                alert("Please try again")
            }
            
        })
        } catch (error) {
            
        }
    }
    handleBack = ()=>{
        this.props.history.push('./taskboard');
    }
    getItem = ()=>{
        console.log(this.state.list);
        return (
            this.state.list.map((item,index)=><div key = {index}className="user_request_box">
                <p className="user_request_name">{item.userName}</p>
                <div className='buttonBox'>
                    <ViewProfileButton id={item.requestUser}></ViewProfileButton>
                    <Button variant="primary" name="accept" value={item.requestUser} onClick={this.handleShow}>Accept</Button>
                    <Button variant="danger" name="decline" value={item.requestUser} onClick={this.handleShow}>Decline</Button>
                </div>
            </div>)
        )
    }
    render(){
        return (
            <div className="container">
                <div className='request_container'>
                <button type="button" className="btn btn-info btn-xs request_back" onClick={this.handleBack}>Back</button>
                    <p>Request Lists</p>
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
            </div>
        )
    }
}

export default UserRequest