import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// LỖI ĐƯỜNG DẪN ĐÃ ĐƯỢC SỬA: Dùng '../' để đi ra khỏi thư mục 'routers'
import AdminLayout from '../../src/components/AdminLayout/AdminLayout'; 
import AdminDashboard from '../../src/pages/Admin/Dashboard';
import HomePage from '../../src/pages/HomePage';
import RegisterPage from '../../src/pages/RegisterPage'; 
// import UserManagement from '../pages/Admin/UserManagement'; // Mở comment khi tạo file này

// =======================================================
// === MOCK AUTH LOGIC (GIẢ LẬP CỬA SAU) ===
// =======================================================
const MOCK_ADMIN_AUTHENTICATED = true; 
const ADMIN_LOGIN_PATH = '/login';

const isAuthenticatedAdmin = () => {
    // GIỮ LÀ TRUE KHI ĐANG PHÁT TRIỂN GIAO DIỆN ADMIN
    return MOCK_ADMIN_AUTHENTICATED; 
};

// Component Route bảo vệ (Protected Route) - Lỗi JSX.Element đã được sửa
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isAuthenticatedAdmin()) {
        return <Navigate to={ADMIN_LOGIN_PATH} replace />;
    }
    return children;
};
// =======================================================

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path={ADMIN_LOGIN_PATH} element={<RegisterPage />} /> 

        {/* Admin Protected Routes (FE của bạn nằm ở đây) */}
        <Route
            path="/admin"
            element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
          {/* Định tuyến các trang con */}
          <Route index element={<AdminDashboard />} /> 
          <Route path="dashboard" element={<AdminDashboard />} /> 
          {/* Thêm các route admin khác: medicines, patients, reports... */}
          
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;