import React, { Component} from 'react'
import { DropdownButton,Dropdown} from 'react-bootstrap';
import './Collaboration.css'
class Collaboration extends Component{
    constructor(props) {
        super(props);
    }
    handleClick = ()=>{
        this.props.history.push('./userrequest');
    }
    handleSearch = ()=>{
        this.props.history.push('./searchuser');
    }
    handleGroup = () =>{
        this.props.history.push('./groups');
    }
    handleView = () =>{
        this.props.history.push('./connections');
    }
    
    render(){
        return (
            <DropdownButton id="t1" className="t1" title="Users">
                <Dropdown.Item onClick={this.handleSearch} href="">Search User</Dropdown.Item>
                <Dropdown.Item onClick={this.handleClick} href="">Requests</Dropdown.Item>
                <Dropdown.Item onClick={this.handleView} href="">My Connections</Dropdown.Item>
            </DropdownButton>
        )
    }
}

export default Collaboration;