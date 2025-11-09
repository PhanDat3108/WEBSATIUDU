import React from "react";
// [SỬA 1] Import 'App' (để dùng message) và 'useNavigate'
import { Form, Input, Button, App } from "antd"; 
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // <-- Thêm import
import { loginAPI } from "../../../api/loginApi";

interface LoginFormValues {
  taiKhoan: string;
  matKhau: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // <-- [SỬA 2] Thêm hook navigate
  const { message } = App.useApp(); // <-- [SỬA 3] Lấy message từ hook (để sửa warning)

  const onFinish = async (values: LoginFormValues) => {
    try {
      // response bây giờ sẽ là: { token: "...", user: { MaNhanVien: "...", ... } }
      const response = await loginAPI(values); 

      message.success("Đăng nhập thành công!");

      // [SỬA 4] Lưu các mục riêng lẻ (đúng cách)
      // Code này giờ sẽ chạy đúng vì response.user đã tồn tại
      localStorage.setItem("token", response.token);
      localStorage.setItem("maNhanVien", response.user.MaNhanVien);
      localStorage.setItem("tenNhanVien", response.user.TenNhanVien);
      localStorage.setItem("vaiTro", response.user.VaiTro);
      
      // [SỬA 5] Chuyển hướng người dùng đến trang dashboard
      navigate("/admin/dashboard");

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