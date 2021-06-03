import React,{useEffect,useRef } from 'react';
import { message,Upload ,Button,Image} from 'antd'
import {connect} from "react-redux"
import Chat, { useMessages } from '@chatui/core';
import Cookie from "js-cookie"
import defaultAvatar from "../../reset/defaultAvatar.svg";
import MyBubble from "../TabBar/bubbles"
import moment from 'moment';
import pic from "../../reset/pic.svg"
import Header from "../TabBar/header"
import  assistant from "../../reset/img/zuli.png";
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';
let socket;;
const initialMessages = [
  {
    type: 'text',
    content: { text: '主人好，我是祥子哥，你的贴心小助理~' },
    user: { avatar: assistant },
    name:'管家祥',
  }
  // ,{
  //   type: 'image',
  //   name:'管家祥',
  //   content: {
  //     picUrl:assistant ,
  //   },
  // },
];
const toolbar=[
  {
    type: 'img', // 类型
    //icon: '', // 图标（svg），与下面的 img 二选一即可
    img: pic, // 图片（img），推荐用 56x56 的图，会覆盖 icon
    title: '相册', // 名称
  },
];
let buton =null;
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
function renderMessageContent(msg) {
  const { type, content ,name} = msg;

  // 根据消息类型来渲染
  switch (type) {
    case 'text':
      return <MyBubble name={name} content={content.text} />

    case 'image':
      return (
        <MyBubble type="image"  name={name}>
          {/* <img src={content.picUrl}  alt="" /> */}
          <Image
            src={content.picUrl}
          />
        </MyBubble>
      );
 
    default:
      return null;
  }
}
const App = (props) => {
  const {userInfo:{username,avatar1}} = props;
  const wrapper = useRef();
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  useEffect(()=>{ //didMount 
     
    socket = require('socket.io-client')('http://localhost:8080/')
    socketFunc()
    return()=>{ //卸载期
      console.log('卸载了');
      socket.close()
      Cookie.remove('chatToken');
    }
  },[])

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
      const {avatar1,username,value,type} = data;
      switch(type){
        case "image":
          //发送消息
          appendMsg({
            type: 'image',
            name:username,
            user: { avatar: avatar1 }, //头像
            content: { picUrl: value },
          });
          //添加到默认数据
          initialMessages.push({
            type: 'image',
            user: { avatar:avatar1? avatar1:defaultAvatar }, //头像
            name:username,
            content: { picUrl: value },
          })
          break;
        case "text":
          appendMsg({
            type: 'text',
            name:username,
            user: { avatar: avatar1 }, //头像
            content: { text: value },
          });
          //添加到默认数据
          initialMessages.push({
            type: 'text',
            user: { avatar: avatar1 }, //头像
            content: { text: value },
          })
          break;
      } 
    })
  }
    
    

  

    
  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        user: { avatar: avatar1?avatar1:defaultAvatar }, //头像
        content: { text: val },
        name:username,
        position: 'right',  //出现位置  不填默认左边
      });
      //添加到默认数据
      initialMessages.push({
        type: 'text',
        user: { avatar:avatar1? avatar1:defaultAvatar }, //头像
        name:username,
        content: { text: val },
        position: 'right',  //出现位置  不填默认左边
      })
      //发送数据;
      socket.emit('chat',{ 
        msg:{
            username:username,
            avatar1:avatar1,
            value: val,
            type:"text",
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

  const onToolbarClick = (item,context)=>{
    // item 即为上面 toolbar 中被点击的那一项，可通过 item.type 区分
      // ctx 为上下文，可用 ctx.appendMessage 渲染消息等
    const {type} = item; //点击项类型
    switch(type){
      case "img":
        buton.previousElementSibling.click()
        break;
      default:
        break;
    }
  }
  const onImageSend = (a,b,c)=>{
    console.log(a,b,c);
  }
  const onAccessoryToggle = (a,b,c)=>{
    console.log(a,b,c);
  }
  const onInputTypeChange =(a,b,c)=>{
    console.log(a,b,c);
  }
  const beforeUpload = (file) => {
    getBase64(file, (imageUrl) => {
      /** */
      //发送数据;
      const {userInfo:{username,avatar1}} = props;
      console.log(props);
      socket.emit('chat',{ 
        msg:{
            username:username,
            avatar1:avatar1,
            type:"image",
            value:imageUrl,
            datetime: moment().format('YYYY-MM-DD:HH:MM:SS'),
          },
      });
      //发送消息
      appendMsg({
        type: 'image',
        name:username,
        user: { avatar: avatar1 }, //头像
        content: { picUrl: imageUrl },
        position: 'right',  //出现位置  不填默认左边
      });
      //添加到默认数据
      initialMessages.push({
        type: 'image',
        user: { avatar:avatar1? avatar1:defaultAvatar }, //头像
        name:username,
        content: { picUrl: imageUrl },
        position: 'right',  //出现位置  不填默认左边
      })


    });
    return false;
  };
  //取图片base64
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);

  };
  const config = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // console.log(info);
        message.success(`${info.file.name} 读取成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 读取失败`);
      }
    },
  };
  return (
    <>
      <Chat
        ref={wrapper}
        navbar={{ title: '卖猪狗大队' }}
        renderNavbar={()=><NavBar {...props}></NavBar>}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
        onImageSend={onImageSend}
        toolbar={toolbar} 
        onToolbarClick={onToolbarClick}
        onAccessoryToggle={onAccessoryToggle}
        onInputTypeChange={onInputTypeChange}
      />
      <Upload 
        {...config} 
        className="upImg" 
        accept="image/png, image/jpeg"
        beforeUpload={beforeUpload}
      >
        <Button ref={(ref)=>{buton=ref}} >Click to Upload</Button>
      </Upload>
    </>
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