import React, {Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Groups.css'
import axios from 'axios'
import { Button } from 'react-bootstrap';
import store from '../store';
import ViewProfileButton from '../components/ViewProfileButton'

class Groups extends Component{
    constructor(props){
        super(props);
        this.state = {
            list:[],
            noResult:''
        }
    }
    componentDidMount = ()=>{
        try {
            const userId = store.getState().id;
            // send id to get group information
            axios.defaults.crossDomain=true;
            axios.get('http://localhost:5000/groups/'+userId).then((res)=>{
            // store the user id in store
            console.log(res)
            // const result = JSON.parse(res.data);
            const testResult = JSON.parse(res.data);
            let warn = ''
            if(testResult.length === 0) {
                warn = 'No Groups'
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
    getMem = (list)=>{
        console.log(list);
        return (
            list.map((item,index)=>
                <div className="group_member_box" key = {index}>
                    <p className="group_user">{item.userName}</p>
                    <ViewProfileButton id={item.requestUser}></ViewProfileButton>
                </div>
            )
        )
    }
    getItem = ()=>{
        console.log(this.state.list);
        return (
            this.state.list.map((item,index)=>
            <div className="groupsDetail" key = {index}>
                <p>{item.groupName}</p>
                <div className="group_ibox">
                    {this.getMem(item.members)}
                </div>
            </div>)
        )
    }
    handleBack = ()=>{
        this.props.history.push('./taskboard');
    }
    createGroup = ()=>{
        this.props.history.push('./creategroup');
    }
    render(){
        return(
            <Fragment>
               <div className="container">
                    <div className="groups_container">
                        <div className="group_btn_box">
                            <button type="button" className="btn btn-info btn-xs request_back" onClick={this.handleBack}>Back</button>
                            <button type="button" className="btn btn-success btn-xs request_back" onClick={this.createGroup}>Create Group</button>
                        </div>
                        <p>Groups you are in</p>
                        <div className="group_lists">
                            {this.getItem()}
                        </div>
                        <p>{this.state.noResult}</p>
                    </div>
                </div> 
            </Fragment>
        )
    }
}

export default Groups;