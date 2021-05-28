import React,{useEffect,useState} from 'react';
import { message } from 'antd'
import {connect} from "react-redux"
import Chat, { Bubble, useMessages } from '@chatui/core';
import moment from 'moment';
import pic from "../reset/pic.svg"
import Header from "./TabBar/header"
import  assistant from "../reset/img/zuli.png";
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';
let socket;;
const initialMessages = [
  {
    type: 'text',
    content: { text: '主人好，我是祥子哥，你的贴心小助理~' },
    user: { avatar: assistant },
  },{
    type: 'image',
    content: {
      picUrl:assistant ,
    },
  },
];

const NavBar = (props)=>{
  const {userInfo:{username},userInputtingList,userList} = props;
  return<div className="home-header">
    <Header 
      username={username} 
      userList={userList} 
      userInputtingList={userInputtingList}
    ></Header>
  </div>
}

const App = (props) => {
  const {userInfo:{username,avatar1}} = props;
  
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  useEffect(()=>{ //didMount
    socket = require('socket.io-client')('http://localhost:8080')
    socketFunc()
    return()=>{ //卸载期
      socket.close()
    }
  },[])
  const toolbar=[
    {
      type: 'img', // 类型
      //icon: '', // 图标（svg），与下面的 img 二选一即可
      img: pic, // 图片（img），推荐用 56x56 的图，会覆盖 icon
      title: '相册', // 名称
    },
  ];
  const Toastlogin = (val) => {
    message.info(val+'进入了聊天室');
  };
  const Toastlogout = (val) => {
    message.warning(val+'离开了聊天室');
  };
  const socketFunc =()=>{
    //连接成功
    socket.on('open', data=> {
      console.log('连接成功',data);  
      socket.emit('toastUser',{ //发送上线消息
        username:props.userInfo.username,
      })
    });
    
    //通知所有人   上线  下线  type:'logout' 'login'
    socket.on('toastUser',(data)=>{
      console.log(data);
      const {userList,type} = data;
      switch(type){
        case "logout":
          Toastlogout(data.username); //下线
          break;
        case "login":
          Toastlogin(data.username); //上线
          break;
        default:break;
      }
      props.dispatch({
        type:"USERLIST",
        payload:{
          userList
        }
      })
      
      
    })


    //聊天信息
    socket.on('getMessage',(data)=>{
      const {avatar1,username,value} = data;
      console.log(data);
      appendMsg({
        type: 'text',
        user: { avatar: avatar1 }, //头像
        content: { text: value },
      });
      //添加到默认数据
      initialMessages.push({
        type: 'text',
        user: { avatar: avatar1 }, //头像
        content: { text: value },
      })
      
    })
  }
    
    

  

    
  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        user: { avatar: avatar1 }, //头像
        content: { text: val },
        position: 'right',  //出现位置  不填默认左边
      });
      //添加到默认数据
      initialMessages.push({
        type: 'text',
        user: { avatar: avatar1 }, //头像
        content: { text: val },
        position: 'right',  //出现位置  不填默认左边
      })
      //发送数据;
      socket.emit('chat',{ 
        msg:{
            username:username,
            avatar1:avatar1,
            value: val,
            datetime: moment().format('YYYY-MM-DD:HH:MM:SS'),
          },
      });
      
      // setTyping(true);

      // setTimeout(() => {
      //   appendMsg({
      //     type: 'text',
      //     position: 'left',
      //     user: { avatar: avatar1 }, //头像
      //     content: { text: 'Bala bala' },
      //   });
      // }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <Chat
      navbar={{ title: '卖猪狗大队' }}
      renderNavbar={()=><NavBar {...props}></NavBar>}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
      toolbar={toolbar} 
    />
  );
};

const mapStateToProps = (state)=>{
  return{
    userInfo:state.userInfo,  //用户信息
    userList:state.userList, //在线的用户列表
    msgList:state.msgList, //消息列表
  }
}
export default connect(mapStateToProps)(App);