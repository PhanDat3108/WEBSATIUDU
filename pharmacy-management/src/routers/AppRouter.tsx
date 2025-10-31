import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages & Layouts
import AdminLayout from '../components/AdminLayout/AdminLayout'; 
import AdminDashboard from '../pages/Admin/Dashboard';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage'; 
import MedicineManagement from '../pages/Admin/MedicineManagement';
import PatientManagement from '../pages/Admin/PatientManagement';
import Reports from '../pages/Admin/Reports';
import Revenue from '../pages/Admin/Revenue'; // <-- [IMPORT MỚI]

// =======================================================
// === MOCK AUTH LOGIC (Giữ nguyên) ===
// =======================================================
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
// =======================================================

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path={ADMIN_LOGIN_PATH} element={<RegisterPage />} /> 

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
          <Route path="reports" element={<Reports />} />
          <Route path="revenue" element={<Revenue />} /> {/* <-- [ROUTE MỚI] */}
          
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;