import { Calendar, Badge } from 'antd';
import React from 'react'
import { Fragment } from 'react';
import { Component } from 'react';
import TaskCard from '../components/TaskCard';
import './CalendarCom.css'
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios'
import store from '../store';

// Clendar page based on Ant design (https://ant.design/components/calendar/)
class CalendarCom extends Component{
  constructor(props){
    super(props);
    this.state = {
      taskLists:[],
      selectedList:[],
      show:false,
      latest:new Date()
    }
  }
  // set tasks to calendar
  getListData=(value) => {
    let listData = [];
    const tasks = this.state.taskLists;
    if(!tasks) {
      return listData;
    }
    for(let i = 0; i < tasks.length;i++) {
      let end = new Date(tasks[i].deadline);
      value._d.setHours(0);
      // check last day
      if(end.getFullYear() === value._d.getFullYear() && end.getMonth() === value._d.getMonth()&& end.getDate() === value._d.getDate()) {
        listData.push({type:'warning',content:tasks[i].title})
      }
    }
    return listData;
  }
  
  dateCellRender = (value)=> {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }
  
  getMonthData = (value)=> {
    if (value.month() === 8) {
      return 1394;
    }
  }
  
  monthCellRender = (value)=> {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  handleClose = ()=>{
    this.setState(()=>(
        {
            show:false
        }
    ))
  }
  // get Tasks
  componentDidMount(){
    // get task detail
    axios.get(`http://localhost:5000/tasks/assigned/${store.getState().id}`).then((res) => {
      let taskList = JSON.parse(res.data);
      if(!taskList) {
        taskList = [];
      }
      this.setState(()=>({
        taskLists:taskList
      }))
    })
  }
  onSelect = (value)=>{
    let listData = [];
    let tasks = this.state.taskLists;
    for(let i = 0; i < tasks.length;i++) {
      let end = new Date(tasks[i].deadline);
      value._d.setHours(0);
      if(end.getFullYear() === value._d.getFullYear() && end.getMonth() === value._d.getMonth()&& end.getDate() === value._d.getDate()) {
        listData.push(tasks[i]);
      }
    }
    
    if(!listData.length) {
      return;
    }
    this.setState(()=>(
      {
        selectedList:listData,
        show:true
      }
    ))

  }
  render(){
    return (
      <Fragment>
        <Calendar dateCellRender={this.dateCellRender} onSelect={this.onSelect} onPanelChange={this.onPanelChange} monthCellRender={this.monthCellRender} />
        <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header>
            <Modal.Title>My Tasks</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.selectedList.map((task) => {
            return <TaskCard key={task.id} task={task}/>})}</Modal.Body>
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

export default CalendarCom;