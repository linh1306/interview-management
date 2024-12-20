import { Button, Form, FormProps, Input } from "antd";
import { useAuth } from "@/redux/hooks.ts";
import { ModalForgotPassword } from "@/components/forgot";
import { useState } from "react";

type FieldType = {
  username?: string;
  password?: string;
};

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { login } = useAuth();
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    login(values);
  };

  return (
    <div className="h-screen bg-[url('/assets/bg.png')] flex justify-center items-center">
      <ModalForgotPassword
        handleClose={() => { setIsModalVisible(false) }}
        isOpen={isModalVisible}
      />
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        className="w-4/12 bg-white p-8 rounded-lg shadow-lg"
      >
        <div
          className="flex justify-center items-center text-xl w-full h-20 font-bold mb-4 uppercase text-center text-blue-400"
        >
          <img src="/assets/logo.png" alt="logo" className="w-28" />
        </div>
        <div className="flex justify-center items-center text-xl w-full font-bold mb-4">
          Login System
        </div>

        <p className="text-md font-medium mb-1">User Name</p>
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: 'username cannot blank!' }]}
        >
          <Input className="text-md px-5 py-2" placeholder="Username" />
        </Form.Item>

        <p className="text-md font-medium mb-1">Password</p>
        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: 'Password is require!' }]}
          className="text-md"
        >
          <Input.Password className="text-md px-5 py-2" placeholder="Password" />
        </Form.Item>
        <a
          className="underline text-xs w-full text-right"
          onClick={() => setIsModalVisible(true)}
        >
          <p>Forgot password?</p>
        </a>

        <Form.Item>
          <Button htmlType="submit" className="w-full h-10 uppercase text-white text-md rounded-md bg-blue-400 mt-4">
            Login
          </Button>
        </Form.Item>
        <p className="text-xs w-full text-right">
          <span>Don't have an account? </span>
          <a className="underline">Signup</a>
        </p>
      </Form>
    </div>
  )
}
export default Login;
