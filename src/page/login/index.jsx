import React,{useState,useEffect} from "react";
import { Form, Input, Button,Upload,message} from 'antd';
import { UserOutlined, LockOutlined ,UploadOutlined} from '@ant-design/icons';
import store from "../../store"
import Cookie from "js-cookie";
import axios from "../../http"
const normFile = (e) => {
  // console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};


const NormalLoginForm = (props) => {
  const [loading,setLoading] = useState(false);
  const [file,setFile] = useState({});
  //提交事件
  const onFinish = (values) => {
    // console.log(values);
    
    const avatar1 = values.avatar1[0];
    console.log(avatar1);
    setLoading(true);
    console.log(values);
    LoginPost(values).then(()=>{
      // props.history.push("/home");
    })
    
  };
  const beforeUpload = (file) => {
    setFile(file)
    return false;
  };
  const LoginPost = async(values)=>{
    const {username,room} = values;
    let data = new FormData();
    data.append('username',username);
    data.append('room',room);
    data.append('avatar1',file)

    let result = await axios.post('/api/login',data);
    const {src,Token,status,msg} = result.data;
    switch(status){
      case "error":
        message.error(msg);
        break;
      case "success":
        message.error(msg);
        break;
      default:
    }
    console.log(result);
    store.dispatch({
      type:"USERINFO",
      payload:{
        ...values,
        avatar1:src
      }
    })
    Cookie.set('chatToken',{Token},{expires:7});
  
    return;
  }
  useEffect(()=>{

  },[])
  return (
    <>
    <div className="login-background-wrapper"></div>
    <div className="login-wrapper" style={{width:"100%",height:"100%",position:"absolute",top:"0",left:"0"}}>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="avatar1"
        rules={[
          {
            required: true,
            message: '请上传头像',
          },
        ]}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo" action="#" maxCount={1} className="login-upLoad" accept="image/png, image/jpeg" beforeUpload={beforeUpload} listType="picture">
          <Button icon={<UploadOutlined />}>点击上传头像</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请填写您的姓名!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="姓名" />
      </Form.Item>
      <Form.Item
        name="room"
        rules={[
          {
            required: false,
            message: '请填写您的房间号',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="room"
          placeholder="房间号"
        />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} >
          登陆
        </Button>
      </Form.Item>
    </Form>
    </div>
    </>
  );
};

export default NormalLoginForm;

