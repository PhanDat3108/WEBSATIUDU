// src/routers/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Imports Pages & Components ---
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Login/components/RegisterPage';
import HomePage from '../pages/Home/HomePage';
import AdminLayout from '../components/AdminLayout/AdminLayout'; 
import MedicineManagement from '../pages/Admin/MedicineManagement';
import PatientManagement from '../pages/Admin/PatientManagement';
import NhanVienManagement from '../pages/Admin/NhanVienManagement';
import Reports from '../pages/Admin/Reports';
import Revenue from '../pages/Admin/Revenue'; 
import { PhieuNhapManagement } from '../pages/Admin/PhieuNhapManagement'; 
import NhaCungCapManagement from '../pages/Admin/NhaCungCapManagement';
import LoaiThuocManagement from '../pages/Admin/LoaiThuocManagement';
import { XuatNoiBoManagement } from "../pages/Admin/XuatNoiBoManagement";
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
         


      
        <Route element={<ProtectedRoute allowedRoles={['nhanvien']} />}>
           
            <Route path="/home" element={<HomePage />} />
            
        </Route>


        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            
           
            <Route path="/admin" element={<AdminLayout />}>
           
                
                
<Route index element={<Revenue />} />

                <Route path="revenue" element={<Revenue />} /> 
                <Route path="medicines" element={<MedicineManagement />} />
                <Route path="categories" element={<LoaiThuocManagement />} />
                <Route path="suppliers" element={<NhaCungCapManagement />} />

     
                <Route path="import" element={<PhieuNhapManagement />} />
                <Route path="export" element={<XuatNoiBoManagement />} /> 

         
                <Route path="employees" element={<NhanVienManagement />} />
                <Route path="patients" element={<PatientManagement />} />

                <Route path="reports" element={<Reports />} />
                
       
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;