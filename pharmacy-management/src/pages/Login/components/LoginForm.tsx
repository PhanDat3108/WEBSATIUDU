import React from "react";
import { Form, Input, Button, App } from "antd"; 
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
// [SỬA 1] Import object 'loginApi' thay vì 'loginAPI'
import { loginApi } from "../../../api/loginApi"; 

interface LoginFormValues {
  taiKhoan: string;
  matKhau: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values: LoginFormValues) => {
    try {
      // [SỬA 2] Gọi đúng hàm .login() và truyền tham số rời
      const response = await loginApi.login(values.taiKhoan, values.matKhau); 

      message.success("Đăng nhập thành công!");

      // --- [SỬA 3: QUAN TRỌNG NHẤT] ---
      // ProtectedRoute cần đọc 'user' để biết role, thiếu dòng này là bị lỗi loop
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      
      // (Tuỳ chọn) Lưu thêm các biến lẻ nếu code cũ cần dùng
      localStorage.setItem("maNhanVien", response.user.MaNhanVien);
      localStorage.setItem("vaiTro", response.user.VaiTro);
      // --------------------------------

      // [SỬA 4] Điều hướng đúng theo quyền
      const role = response.user.VaiTro;
      
      // Kiểm tra các role Admin (khớp với DB của bạn: 'Quản lý', 'Admin'...)
      if (role === 'admin' ) {
        navigate('/admin/revenue'); 
      } else {
        // Role nhân viên/dược sĩ về trang chủ bán hàng
        navigate('/home'); 
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      message.error(error.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} autoComplete="off" layout="vertical">
      <Form.Item 
        name="taiKhoan" 
        label="Tài khoản" 
        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nhập tài khoản" />
      </Form.Item>

      <Form.Item 
        name="matKhau" 
        label="Mật khẩu" 
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
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