import React from "react";
import { Form, Input, Button, App } from "antd"; 
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
// [SỬA 1] Import đúng object loginApi
import { loginApi } from "../../../api/loginApi";

interface RegisterFormValues {
  tenNhanVien: string;
  taiKhoan: string;
  matKhau: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp(); 

  const onFinish = async (values: RegisterFormValues) => {
    try {
      // [SỬA 2] Gọi đúng hàm loginApi.register
      const response = await loginApi.register({
        tenNhanVien: values.tenNhanVien,
        taiKhoan: values.taiKhoan,
        matKhau: values.matKhau,
        vaiTro: "nhanvien",
      });

      message.success(`Đăng ký thành công! Mã nhân viên: ${response.MaNhanVien}`);
      form.resetFields();
      onRegisterSuccess(); 

    } catch (error: any) {
      message.error(error.message || "Đăng ký thất bại!");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} autoComplete="off" layout="vertical">
      <Form.Item
        name="tenNhanVien"
        label="Tên nhân viên"
        rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nhập tên nhân viên" />
      </Form.Item>

      <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}>
        <Input prefix={<MailOutlined />} placeholder="Nhập tài khoản" />
      </Form.Item>

      <Form.Item
        name="matKhau"
        label="Mật khẩu"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={["matKhau"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("matKhau") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;