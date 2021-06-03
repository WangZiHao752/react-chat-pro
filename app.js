let _app = require('express');
const Login  = require('./serve/api/login')
const _Static = require('./serve/static')
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path')
//在线用户列表
let userList = [
  // {
  //   username:"123456",
  //   id:"asdaffasfasf",
  //   isInputting:true,
  // }
]; 
app.use('/',_app.static('./build')); //静态资源
app.use('/static', _app.static(path.join(__dirname, '/images')));
app.use(_Static); //页面
app.use(_app.json()); //解析json
app.use(Login);   //登陆模块

//io中间件  验证连接权限
io.use(function(socket, next) {
  // execute some code
  next();
})

io.on('connection', function (socket) {
  
  const {id} = socket;

  //断开连接
  socket.on('disconnect', function () {
    let removeBoj = {};
    userList.forEach((item,ind)=>{
      if(item.id==id){
        removeBoj={
          remId : ind,
          username:item.username
        }
      }
    })

    
    userList.splice(removeBoj.remId,1); //删除该用户
    
    console.log(removeBoj.username+'断开了连接当前在线人数'+userList.length);
    
    

    //通知所有人 有人下线了
    io.sockets.emit('toastUser',{
      username:removeBoj.username, //用户名
      userList,
      type:"logout"
    })
    removeBoj={};
  })


  socket.on('userlist_push_username', function (data) {
    const {username} = data;
    const currentUser = userList.find(item=>item.id===id);
    Object.assign(currentUser,{username});  //用户列表增加username字段
  });

  //聊天信息
  // avatar1:rul
  // datetime: "2021-05-22:09:05:04"
  // id: "RlAj9EexpmGSgezhAAAe"
  // username: "苏祥"
  // value: "聊天内容"
    socket.on('chat',function(data){
      const { msg} = data;
      socket.broadcast.emit('getMessage',{
        id,
        ...msg
      })
    })

  //用户正在输入事件
    socket.on('userInputting',function(data){

      // const { username} = data;
      //修改用户输入状态
      const currentInputt = userList.find(item=>item.id==id);
      Object.assign(currentInputt,{isInputting:true});

      io.sockets.emit('userInputting',{
        userList
    })
  })

  //用户结束输入事件
  socket.on('userEndInput',function(data){
    const { username} = data;
    const currentInputt = userList.find(item=>item.id==id);
      Object.assign(currentInputt,{isInputting:false});

      io.sockets.emit('userEndInput',{
        userList
    })
  })

  //通知所有人**上线
  socket.on('toastUser',(data)=>{
    const {username } = data;
    //给用户列表添加网名
    const currentUser = userList.find(item=>item.id==id);
    Object.assign(currentUser,{username});
    console.log(username+'成功连接当前在线人员'+userList.length);
    io.sockets.emit('toastUser',{
      username, //用户名
      userList,
      type:"login"
    })
  })
})

//连接事件
io.on('connect',(socket)=>{
  const {id} = socket;
  userList.push({
    username:'',
    id,
    isInputting:false
  });
  
  socket.emit('open', {
    statu: '连接成功',
    uuid:id,
    currentAlive:userList.length,
  });

})


server.listen(8080,console.log('http://localhost:8080'));