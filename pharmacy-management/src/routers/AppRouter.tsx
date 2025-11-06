import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';


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
import Navbar from "../components/Navbar"



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
    
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginHomePage />} />


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
          <Route path="patients" element={<PatientManagement />} />
          <Route path="employees" element={<NhanVienManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="chinhthuoc" element={<TestThuoc />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    
    </>
  );
};


export default AppRouter;