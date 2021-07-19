import React, { Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Login.css'
import axios from 'axios'
import store from '../store';
import Photo from './Photo';
import UploadFile from './UploadFile';

class TestPage extends Component{
    constructor(props) {
        super(props);
        // modify this part to set the post url where the backend will receive data.
        this.state={
            photoPost:"http://localhost:5000/user/upload",
            taskId:1
        }
    }
    photoUrl = (value)=>{
        console.log(value);
    }
    render (){
        return(
            <Fragment>
                <Photo ></Photo>
                <UploadFile taskId = {this.state.taskId}></UploadFile>
            </Fragment>
        )
    }
}
export default TestPage