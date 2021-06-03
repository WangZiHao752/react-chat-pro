### 在线用户列表
```js
userList = [
  {
    username:"123456",  //登陆时的用户名
    id:"asdaffasfasf",  //连接id
    isInputting:true,  //是否输入中
    /*一下均为待添加*/
    //avatar1：url   //头像指向路径
    //level:1,2,3,4,5,6,7,9  等级制度 
    //roomAdmin：true   是否有群管理资格  {禁言，踢出，炫彩聊天气泡}
  }
]; 
```


### `chat`事件 数据格式
```js
{
  avatar1:rul,  //当前为base64格式  待优化  头像可以保存本地 返回一个头像路径
  datetime: "2021-05-22:09:05:04",
  id: "RlAj9EexpmGSgezhAAAe",
  username: "苏祥",
  value: "聊天内容",
}
```

### `toastUser` 事件 数据格式
```js
{
    username, //用户名
    userList,  //在线用户列表   ***可优化
    type:"login"  //加入或退出  加入：login  退出：logout
}
     
```
### 待完善TOKEN验证机制
1、用jsonwebtoken生成token
2、用express-jwt验证token是否过期或失效
3、用jsonwebtoken解析出token中的用户信息，比如用户id

### 待添加 
1. 发送消息为图片类型
