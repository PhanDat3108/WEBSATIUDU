// src/api/benhNhanApi.ts
import { BenhNhan } from '../interfaces';

// URL này được giả định là /api/v1/benhnhan (do server.js của bạn cấu hình)
const API_BASE_URL = '/api/v1/benhnhan';

/**
 * [ĐÃ SỬA] Lấy danh sách bệnh nhân
 * Sửa lại để gọi API thật
 */
export const getPatients = async (): Promise<BenhNhan[]> => {
  const response = await fetch(API_BASE_URL); // Gọi GET /api/v1/benhnhan
  if (!response.ok) {
    throw new Error('Không thể tải danh sách bệnh nhân');
  }
  return await response.json();
};

/**
 * [ĐÃ SỬA] Cập nhật thông tin bệnh nhân
 * Sửa lại để "dịch" dữ liệu sang camelCase cho BE
 */
export const updatePatient = async (maBenhNhan: string, data: Partial<BenhNhan>): Promise<BenhNhan> => {
  
  // [SỬA LỖI Ở ĐÂY]
  // 'data' (từ form) chỉ chứa Ten, NgaySinh...
  // 'maBenhNhan' được lấy từ tham số hàm
  const dataForBackend = {
    MaBenhNhan: maBenhNhan,          // <-- Lấy từ tham số `maBenhNhan`
    TenBenhNhan: data.TenBenhNhan,   // <-- Lấy từ `data` (formData)
    NgaySinh: data.NgaySinh,         
    GioiTinh: data.GioiTinh,         
    SoDienThoai: data.SoDienThoai,   
    DiaChi: data.DiaChi              
  };

  // BE của bạn dùng route "/fix"
  const response = await fetch(`${API_BASE_URL}/fix`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // Gửi dữ liệu đã "dịch" (camelCase)
    body: JSON.stringify(dataForBackend), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật thất bại');
  }
  
  const result = await response.json();
  
  // Trả về data (dạng PascalCase) để cập nhật UI
  // Chúng ta dùng data gốc (biến 'data') và 'maBenhNhan' để tạo lại
  return { ...data, MaBenhNhan: maBenhNhan } as BenhNhan;
};

/**
 * [ĐÃ SỬA] Xóa bệnh nhân
 * Sửa lại để gọi API thật
 */
export const deletePatient = async (maBenhNhan: string): Promise<void> => {
  // BE của bạn dùng "/delete/:maBenhNhan"
  const response = await fetch(`${API_BASE_URL}/delete/${maBenhNhan}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Xóa thất bại');
  }
};

/**
 * Hàm thêm (Tạm thời vô hiệu hóa)
 */
export const addPatient = async (benhNhanData: Omit<BenhNhan, 'MaBenhNhan'>): Promise<BenhNhan> => {
  console.log('GỌI API: addPatient (BE CHƯA SẴN SÀNG)', benhNhanData);
  return Promise.reject(new Error('Chức năng chưa sẵn sàng (đang chờ BE).'));
};