import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  
  console.log("ProtectedRoute Check:", { allowedRoles, userStr, token });

  if (!userStr || !token) {
    console.log("-> Chưa đăng nhập, redirect về /login");
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  const userRole = user.VaiTro; 
  console.log("-> User Role:", userRole);


  if (!allowedRoles.includes(userRole)) {
    console.log(`-> Quyền ${userRole} không được phép vào đây. Allowed:`, allowedRoles);
    
    
    if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    if (userRole === 'nhanvien') {
        return <Navigate to="/home" replace />;
    }
    
   
    return <Navigate to="/login" replace />;
  }

 
  console.log("-> Access GRANTED");
  return <Outlet />;
};

export default ProtectedRoute;