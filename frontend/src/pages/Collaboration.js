import React, {useContext, Component, Fragment} from 'react'
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
    render(){
        return (
            <DropdownButton id="t1" className="t1" title="Users">
                <Dropdown.Item onClick={this.handleSearch} href="">Search User</Dropdown.Item>
                <Dropdown.Item href="">My Team</Dropdown.Item>
                <Dropdown.Item onClick={this.handleClick} href="">Request</Dropdown.Item>
            </DropdownButton>
        )
    }
}

export default Collaboration;