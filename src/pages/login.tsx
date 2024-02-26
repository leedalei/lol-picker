import { Button, Form, Input, message } from 'antd'
import axios from 'axios';
import React from 'react'
import { history } from 'umi';

type FieldType = {
  userName?: string;
};

const Login: React.FC = () => {
  const onFinish = async (values: any) => {
    const {data} = await axios.post("/api/login", values)
    console.log(data)
    if(!data.success) {
      return message.error(data.message)
    }
    message.success("Login Success")
    localStorage.setItem("player", data.data)
    history.push('/home')
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='flex justify-center items-center flex-col w-[400px] mt-[300px] p-4 bg-white shadow-xl mx-auto rounded-lg'>
      <div className='font-bold mb-10 text-lg mt-6'>Welcome To LOL Picker</div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="userName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            原神！启动！
          </Button>
        </Form.Item>
      </Form>
    </div>

  )
}

export default Login