import React, { Component, Fragment} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import store from '../store';
import {Chat} from '../components/chatBot'
import botImage from '../components/chatBot/image/chatBot.jpg'
import dayjs from 'dayjs'

// Reference of ChatBot interface: https://gitee.com/wx_504ae56474/react-jwchat

class ChatTest extends Component{
    constructor(props) {
        super(props);
        if (store.getState() === undefined || store.getState().id === "") {
            this.props.history.push('/home')
        }
        let date = new Date().getMonth()+'-'+new Date().getDate();
        const bot = {
            id: -1,
            avatar: botImage,
            nickname: 'Chat Bot',
            date: date,
            desc: 'I\'m an AI',
        };
        const startMessage = {
            _id: '-1',
            date: dayjs().unix(),
            user: bot,
            message: { type: 'text', content: 'What can I do for you' },
        }
        this.state={
            chatBot:bot,
            user:{},
            msgList:[startMessage],
            userInform:{}
        }
    }
    componentDidMount = ()=>{
        // get the current date and user
        const currentUser = store.getState().id;
        axios.defaults.crossDomain=true;
        let date = new Date().getMonth()+'-'+new Date().getDate();
        try {
            axios.get('http://localhost:5000/user/'+currentUser,{timeout:60000}).then((res)=>{
                const data = JSON.parse(res.data);
                console.log(data);
                this.setState(()=>({
                    user:{
                        id:data.id,
                        avatar: data.image_path === 'None'?'//game.gtimg.cn/images/lol/act/a20201103lmpwjl/icon-ht.png':data.image_path,
                        nickname: data.first_name+' '+data.last_name,
                        date: date,
                        desc: data.username,
                    },
                    userInform:data
                }))
            })
        } catch (error) {
            console.log(error);
        }
    }
    getRes = (res)=>{
        // send message to the backserver
        const msgNew = {"message": res.message.content, "user":this.state.userInform};
        // set user message to the interface
        this.setState((pre)=>({
            msgList:[...pre.msgList,res]
        }));
        // send reply message, 
        let botReply = JSON.parse(JSON.stringify(res));
        botReply._id=botReply._id.slice(0,-1);
        botReply.user = this.state.chatBot;
        botReply.date = dayjs().unix();
        try {
            axios.defaults.crossDomain=true;
            axios.post('http://localhost:5000/chatbot',msgNew).then((res)=>{
                console.log(res);
                botReply.message.content = res.data.fulfillment_text;
                this.setState((pre)=>({
                    msgList:[...pre.msgList,botReply]
                }));
            })
        } catch (error) {
            console.log(error);
            botReply.message.content = "Meet some errors. Please try it again";
            this.setState((pre)=>({
                msgList:[...pre.msgList,botReply]
            }));
        }
        
    }
    render (){
        return(
            <Fragment>
                <div className="container">
                <Chat contact={this.state.chatBot} me={this.state.user} onSend={this.getRes} chatList={this.state.msgList} style={{width: 600,height: 500,}}/>
                </div>
            </Fragment>
        )
    }
}
export default ChatTest