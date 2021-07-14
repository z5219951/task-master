import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Groups.css'
import axios from 'axios'
import { Button,Modal } from 'react-bootstrap';
import store from '../store';

class CreateGroup extends Component{
    constructor(props) {
        super(props);
        this.state = {
            groupName:'',
            list:[],
            selectList:[],
            inform:'',
            show:false
        }
    }
    handleBack = ()=>{
        this.props.history.push('./groups');
    }
    componentDidMount = ()=>{
        try {
            const userId = store.getState().id;
            // send id to get group information
            axios.defaults.crossDomain=true;
            axios.get('http://localhost:5000/friends/lists/'+userId).then((res)=>{
            // store the user id in store
            console.log(res)
            // const result = JSON.parse(res.data);
            const testResult = JSON.parse(res.data);
            const selectList = new Array(testResult.length).fill(false);
            this.setState(()=>({
                list:testResult,
                selectList:selectList
            }))
        })
        } catch (error) {
            console.log(error);
        }
    }
    handleName = (e)=>{
        this.setState(()=>({
            groupName:e.target.value,
            groupNameAlert:''
          }))
    }
    handleSelect = (e)=>{
        let newSelectList = this.state.selectList;
        if(e.target.checked) {
            newSelectList[e.target.value] = true;
        } else {
            newSelectList[e.target.value] = false;
        }
        this.setState(()=>({
            selectList:newSelectList
          }))
    }
    getItem = ()=>{
        return (
            this.state.list.map((item,index)=>
            <div className="form-check" key = {index}>
                <label className="form-check-label createGroup_item">
                <input type="checkbox" className="form-check-input" onClick={this.handleSelect} key={index} value={index}/>{item.name}
                </label>
            </div>)
        )
    }
    handleSubmit = ()=>{
        // get selected members
        let selectedMember = [];
        const lists = this.state.selectList;
        const users = this.state.list;
        for(let i = 0; i < lists.length; i++) {
            if(lists[i]) {
                selectedMember.push(Number(users[i].requestedUser));
            }
        }
        // check whether name is valid
        const name = this.state.groupName.trim();
        if(name === '') {
            this.setState(()=>({
                show:true,
                inform:"Please enter a propriate name"
            }))
            return;
        }
        // check whether members are selected
        if(selectedMember.length === 0) {
            this.setState(()=>({
                show:true,
                inform:"Please select your member"
            }))
            return;
        }
        // submit information
        try {
            const userId = Number(store.getState().id);
            selectedMember.push(userId);
            console.log(selectedMember);
            // post data
            const data = {
                userId:userId,
                groupName:name,
                userList:selectedMember
            }
            axios.defaults.crossDomain=true;
            axios.post('http://localhost:5000/groups/create', data).then((res)=>{
                console.log(res.data);
                const result = true;
                let inform = '';
                if(result) {
                    inform = "Group Created!";
                } else {
                    inform = "Group Already created!";
                }
                this.setState(()=>({
                    show:true,
                    inform:inform
                }))
            })
        } catch (error) {
            console.log(error);
        }
    }
    handleClose = ()=>{
        this.setState(()=>({
            show:false
        }))
    }
    render(){
        return (
            <Fragment>
                <div className="container">
                    <div className="groups_container">
                        <div className="group_btn_box">
                            <button type="button" className="btn btn-info btn-xs request_back" onClick={this.handleBack}>Back</button>
                        </div>
                        <div className="creat_groupName_box">
                            <p>Enter the Group Name</p>
                            <input type="text" className="form-control" placeholder="Group Name" value = {this.state.groupName} onChange={this.handleName} required/>
                        </div>
                        <p>Select Your Members</p>
                        <form className="group_lists">
                            {this.getItem()}
                        </form>
                        <button className="btn btn-lg btn-primary btn-block btnCreate" onClick={this.handleSubmit} type="button" >Create Group</button>
                    </div>
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
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

export default CreateGroup 