import { Calendar, Badge } from 'antd';
import React from 'react'
import { Fragment } from 'react';
import { Component } from 'react';
import TaskCard from '../components/TaskCard';
import './CalendarCom.css'
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios'
import store from '../store';

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
  getListData=(value) => {
    let listData = [];
    let tasks = this.state.taskLists;
    for(let i = 0; i < tasks.length;i++) {
      let end = new Date(tasks[i].deadline);
      end.setDate(end.getDate()+1);
      end.setHours(0);
      let start = new Date(tasks[i].creation_date);
      start.setHours(0);
      value._d .setHours(0);
      if(start <= value._d && end >= value._d ) {
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
    console.log("month",value);
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
    axios.get(`http://localhost:5000/user/${store.getState().id}/tasks`).then((res) => {
      const taskList = JSON.parse(res.data).tasks;
      this.setState(()=>({
        taskLists:taskList
      }))
    })
    // this.setState(()=>(
    //   {
    //     taskLists:[{
    //       owner: 0,
    //       title: "test1",
    //       description: "test des",
    //       creation_date: "2021-06-10",
    //       deadline: "2021-07-19",
    //       current_state: "Not Started",
    //       progress: 20,
    //       time_estimate: 5,
    //       difficulty: "Very Easy",
    //       id:1,
    //       labels:[]
    //     },{
    //       owner: 0,
    //       title: "test2",
    //       description: "test des",
    //       creation_date: "2021-06-18",
    //       deadline: "2021-07-10",
    //       current_state: "Not Started",
    //       progress: 20,
    //       time_estimate: 5,
    //       difficulty: "Very Easy",
    //       id:2,
    //       labels:[]
    //     }]
    //   }
    // ))
  }
  onPanelChange = (value)=>{
    // set task event
    // let tasks = this.state.taskLists;
    // console.log("change", value);
    // let selectedTask = [];
    // const latest = this.state.latest;
    // for(let i = 0; i < tasks.length;i++) {
    //   const curr = new Date(tasks[i].deadline);
    //   if(curr <=latest) {
    //     selectedTask.push(tasks[i]);
    //   }
    // }
  }
  onSelect = (value)=>{
    let listData = [];
    let tasks = this.state.taskLists;
    for(let i = 0; i < tasks.length;i++) {
      let end = new Date(tasks[i].deadline);
      end.setDate(end.getDate()+1);
      end.setHours(0);
      let start = new Date(tasks[i].creation_date);
      start.setHours(0);
      value._d .setHours(0);
      if(start <= value._d && end >= value._d ) {
        listData.push(tasks[i]);
      }
    }
    console.log(listData);
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