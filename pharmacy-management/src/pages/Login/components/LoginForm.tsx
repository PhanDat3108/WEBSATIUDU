import React from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginAPI } from "../../../api/loginApi";

interface LoginFormValues {
  taiKhoan: string;
  matKhau: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await loginAPI(values);
      message.success("Đăng nhập thành công!");
      localStorage.setItem("user", JSON.stringify(response));
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} autoComplete="off" layout="vertical">
      <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}>
        <Input prefix={<UserOutlined />} placeholder="Nhập tài khoản" />
      </Form.Item>

      <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
