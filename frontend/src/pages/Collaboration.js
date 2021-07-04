import React, {useContext, Component, Fragment} from 'react'
import { DropdownButton,Dropdown} from 'react-bootstrap';
import './Collaboration.css'
import { useHistory } from 'react-router-dom';
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
    render(){
        return (
            <DropdownButton id="t1" className="t1" title="Users">
                <Dropdown.Item onClick={this.handleSearch} href="">Search User</Dropdown.Item>
                <Dropdown.Item href="">My Team</Dropdown.Item>
                <Dropdown.Item onClick={this.handleClick} href="">Request</Dropdown.Item>
                <Dropdown.Item onClick={this.handleGroup} href="">Groups</Dropdown.Item>
            </DropdownButton>
        )
    }
}

export default Collaboration;