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

        if (store.getState() === undefined || store.getState().id === "") {
            this.props.history.push('/home')
        }
        this.state = {
            list:[],
            noResult:""
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
                warn = 'To create a project, first create a group'
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
        return (
            list.map((item,index)=>
                <div className="group_member_box" key = {index}>
                    <h4 className="group_user">{item.userName} - {item.email}</h4>
                    <ViewProfileButton id={item.userId}></ViewProfileButton>
                </div>
            )
        )
    }
    getItem = ()=>{
        console.log(this.state.list);
        return (
            this.state.list.map((item,index)=>
            <div className="card my-2 mx-5" key={index}> 
                <div className="card-header" padding="100px">
                    <h2>Group #{item.groupID}: {item.groupName}</h2>
                </div>
                <div className="card-body text-muted" padding="100px">
                    {this.getMem(item.members)}
                </div>
                <div className="card-footer text-muted">
                    <button type="button" className="btn btn-success btn-lg m-1" onClick={() => this.handleCreate(item)}> Create a Group Project </button>
                    <button type="button" className="btn btn-success btn-lg m-1" onClick={() => this.handleView(item)} > View Group Projects</button>
                </div>
            </div>)
        )
    }

    handleView = (group) => {
        this.props.history.push({
            pathname: './viewGroupProject',
            state: { group }
        })
    }

    handleCreate = (group)=> {
        this.props.history.push({
            pathname: '/createProject',
            state: { group }
        });
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
                        <h1>Groups you are in</h1>
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