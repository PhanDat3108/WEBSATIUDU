// src/api/nhanVienApi.ts
import { NhanVien } from '../interfaces';

// Thay đổi URL này thành URL backend của bạn
const API_BASE_URL = 'http://localhost:5000/api'; 

// Kiểu dữ liệu cho form (không bao gồm MaNhanVien khi tạo mới)
export type NhanVienFormData = Omit<NhanVien, 'MaNhanVien'>;

export const getNhanVien = async (): Promise<NhanVien[]> => {
  // Khi BE sẵn sàng, hãy bỏ comment code bên dưới
  /*
  const response = await fetch(`${API_BASE_URL}/nhanvien`);
  if (!response.ok) {
    throw new Error('Không thể tải danh sách nhân viên');
  }
  return response.json();
  */

  // Tạm thời trả về mảng rỗng để UI không lỗi
  return Promise.resolve([]);
};

export const updateNhanVien = async (maNV: string, data: Partial<NhanVienFormData>): Promise<NhanVien> => {
  // Khi BE sẵn sàng, hãy triển khai logic fetch PUT/PATCH
  /*
  const response = await fetch(`${API_BASE_URL}/nhanvien/${maNV}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Cập nhật nhân viên thất bại');
  }
  return response.json();
  */
  console.log('Cập nhật nhân viên (chưa kết nối BE)', maNV, data);
  return Promise.reject(new Error("Chức năng chưa được kết nối BE"));
};

export const deleteNhanVien = async (maNV: string): Promise<void> => {
  // Khi BE sẵn sàng, hãy triển khai logic fetch DELETE
  /*
  const response = await fetch(`${API_BASE_URL}/nhanvien/${maNV}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Xóa nhân viên thất bại');
  }
  */
  console.log('Xóa nhân viên (chưa kết nối BE)', maNV);
  return Promise.reject(new Error("Chức năng chưa được kết nối BE"));
};