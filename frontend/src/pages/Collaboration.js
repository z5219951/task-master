import React, {useContext, Component, Fragment} from 'react'
import { DropdownButton,Dropdown} from 'react-bootstrap';
import './Collaboration.css'
class Collaboration extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <DropdownButton id="t1" className="t1" title="Users">
                <Dropdown.Item href="">Search User</Dropdown.Item>
                <Dropdown.Item href="">My Team</Dropdown.Item>
                <Dropdown.Item href="">Request</Dropdown.Item>
            </DropdownButton>
        )
    }
}

export default Collaboration;