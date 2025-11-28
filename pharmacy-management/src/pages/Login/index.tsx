import React, { useState } from "react";
// [SỬA 1] Import thêm 'App' từ antd
import { ConfigProvider, Card, Tabs, App } from "antd"; 
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import LoginBackground from "../../assets/backgroundLogin.jpg";

const cardStyle = {
  width: "450px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  borderRadius: "12px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const LoginHomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleRegisterSuccess = () => {
    setActiveTab("login"); 
  };

  const tabItems = [
    { key: "login", label: "Đăng nhập", children: <LoginForm /> },
    { 
      key: "register", 
      label: "Đăng ký", 
      children: <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#667eea" } }}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${LoginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
        }}
      >
        {/* [SỬA 2] Bọc Card bằng <App> */}
        <App> 
          <Card style={cardStyle}>
            <div style={{ textAlign: "center" }}>
              <h1 style={titleStyle}>Chào mừng bạn</h1>
              <p style={{ color: "#666", margin: 0 }}>Đăng nhập hoặc tạo tài khoản mới</p>
            </div>
            
            <Tabs 
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems} 
              centered 
              size="large" 
            />
          </Card>
        </App> {/* [SỬA 2] Đóng <App> */}
      </div>
    </ConfigProvider>
  );
};

export default LoginHomePage;