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
### 前端上传图片
```js
onToolbarClick(item, ctx) {
  // 如果点的是“相册”
  if (item.type === 'image') {
    ctx.util.chooseImage({
      // multiple: true, // 是否可多选
      success(e) {
        if (e.files) { // 如果有 h5 上传的图
          const file = e.files[0];
          // 先展示图片
          ctx.appendMessage({
            type: 'image',
            content: {
              picUrl: URL.createObjectURL(file)
            },
            position: 'right'
          });
          // 发起请求，具体自行实现，这里以 OCR 识别后返回文本为例
          requestOcr({ file }).then(res => {
            ctx.postMessage({
              type: 'text',
              content: {
                text: res.text
              },
              quiet: true // 不展示
            });
          });
        } else if (e.images) { // 如果有 app 上传的图
          // ..与上面类似
        }
      },
    });
  }
}
```
### 待添加 
1. 发送消息为图片类型
