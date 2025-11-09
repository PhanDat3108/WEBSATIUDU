
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Pages & Layouts
import AdminLayout from '../components/AdminLayout/AdminLayout'; 
import AdminDashboard from '../pages/Admin/Dashboard';
import HomePage from '../pages/HomePage';
import LoginHomePage from "../pages/Login";
import MedicineManagement from '../pages/Admin/MedicineManagement';
import PatientManagement from '../pages/Admin/PatientManagement';
import NhanVienManagement from '../pages/Admin/NhanVienManagement';
import Reports from '../pages/Admin/Reports';
import Revenue from '../pages/Admin/Revenue'; 
import TestThuoc from "../pages/Admin/Testthuoc";
import { PhieuNhapManagement } from '../pages/Admin/PhieuNhapManagement'; 

// [MỚI] Import 2 trang mới
import NhaCungCapManagement from '../pages/Admin/NhaCungCapManagement';
import LoaiThuocManagement from '../pages/Admin/LoaiThuocManagement';


const MOCK_ADMIN_AUTHENTICATED = true; 
const ADMIN_LOGIN_PATH = '/login';

const isAuthenticatedAdmin = () => {
    return MOCK_ADMIN_AUTHENTICATED; 
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isAuthenticatedAdmin()) {
        return <Navigate to={ADMIN_LOGIN_PATH} replace />;
    }
    return children;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginHomePage />} />
        <Route path="home" element={< HomePage/>} />


        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="medicines" element={<MedicineManagement />} />
          
          {/* [MỚI] Thêm 3 routes mới */}
          <Route path="suppliers" element={<NhaCungCapManagement />} />
          <Route path="categories" element={<LoaiThuocManagement />} />
          

          <Route path="patients" element={<PatientManagement />} />
          <Route path="employees" element={<NhanVienManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="chinhthuoc" element={<TestThuoc />} />
          <Route path="import" element={<PhieuNhapManagement />} />

        </Route>

        {/* Các routes khác (ví dụ: 404) */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

export default AppRouter;