// src/pages/Login/components/LoginForm.tsx
import React from "react";
import { Form, Input, Button, Checkbox, App } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../../api/loginApi";
// [SỬA 1] Xóa import LoginPayload
// import { LoginPayload } from "../../../interfaces"; 

// Interface cho giá trị của Form (camelCase)
interface LoginFormValues {
  taiKhoan: string;
  matKhau: string;
  remember?: boolean;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp(); 

  // Dùng interface 'LoginFormValues' (camelCase) cho 'values'
  const onFinish = async (values: LoginFormValues) => {
    try {
      // [SỬA 2] Xóa 'payload' và gửi 'values' (camelCase) thẳng vào API
      // Tệp loginApi.ts của bạn sẽ tự xử lý việc dịch sang PascalCase
      const data = await loginAPI(values); 
      
      message.success("Đăng nhập thành công!");
      
      // Lưu thông tin vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("maNhanVien", data.user.MaNhanVien);
      localStorage.setItem("tenNhanVien", data.user.TenNhanVien);
      localStorage.setItem("vaiTro", data.user.VaiTro);

      // Chuyển hướng đến trang admin
      navigate("/admin/dashboard"); 
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <Form onFinish={onFinish} autoComplete="off" layout="vertical">
      <Form.Item
        name="taiKhoan"
        label="Tài khoản"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Tài khoản (VD: admin)" />
      </Form.Item>

      <Form.Item
        name="matKhau"
        label="Mật khẩu"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu (VD: 123456)" />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Ghi nhớ tôi</Checkbox>
        </Form.Item>
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