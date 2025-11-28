// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  // 1. Lấy user từ localStorage
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // [DEBUG] In ra để kiểm tra xem đang lấy được gì
  console.log("ProtectedRoute Check:", { allowedRoles, userStr, token });

  // 2. Nếu chưa đăng nhập -> Đá về Login
  if (!userStr || !token) {
    console.log("-> Chưa đăng nhập, redirect về /login");
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    // Nếu JSON lỗi -> Xóa và bắt đăng nhập lại
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  const userRole = user.VaiTro; // Lấy vai trò (Ví dụ: 'Quản lý' hoặc 'Dược sĩ')

  // [DEBUG] Kiểm tra vai trò
  console.log("-> User Role:", userRole);

  // 3. Kiểm tra quyền
  // Nếu vai trò của user KHÔNG nằm trong danh sách cho phép
  if (!allowedRoles.includes(userRole)) {
    console.log(`-> Quyền ${userRole} không được phép vào đây. Allowed:`, allowedRoles);
    
    // Logic đá về trang đúng
    if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    if (userRole === 'nhanvien') {
        return <Navigate to="/home" replace />;
    }
    
    // Nếu vai trò lạ hoắc -> Về login
    return <Navigate to="/login" replace />;
  }

  // 4. Nếu OK -> Cho hiển thị
  console.log("-> Access GRANTED");
  return <Outlet />;
};

export default ProtectedRoute;