// src/api/nhanVienApi.ts
import { NhanVien, NhanVienUpdateData, NhanVienCreateData } from '../interfaces';

// [SỬA 1] Sử dụng đường dẫn proxy
const API_BASE_URL = '/api/v1/nhanvien'; 

/**
 * Hàm chung để xử lý response từ fetch
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Thử đọc lỗi dưới dạng JSON trước
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      // Nếu đọc JSON thất bại (vì nó là HTML 404), đọc nó dưới dạng text
      const errorText = await response.text();
      throw new Error(`Lỗi ${response.status}: ${response.statusText}. Phản hồi không phải JSON.`);
    }
  }
  // Nếu response OK (200, 201), trả về data
  // Ngoại trừ DELETE thường không có body
  if (response.status === 204 || response.status === 200 && response.headers.get('content-length') === '0') {
    return;
  }
  return response.json();
};


// [SỬA 2] Kết nối API GET /list
export const getNhanVien = async (): Promise<NhanVien[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`); // BE dùng /list
    const data = await handleResponse(response);
    return data as NhanVien[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhân viên:', error);
    throw error;
  }
};

// Hàm này không dùng đến theo yêu cầu, nhưng để lại để tránh lỗi import
export const createNhanVien = async (data: NhanVienCreateData): Promise<NhanVien> => {
  console.log('Tạo nhân viên (chưa kết nối BE)', data);
  return Promise.reject(new Error("Chức năng Thêm mới đã bị loại bỏ."));
};

// [SỬA 3] Kết nối API PUT /edit
export const updateNhanVien = async (maNV: string, data: NhanVienUpdateData): Promise<NhanVien> => {
  try {
    // BE (nhanvien.js) dùng /edit và lấy MaNhanVien từ body
    const response = await fetch(`${API_BASE_URL}/fix`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        MaNhanVien: maNV 
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    throw error;
  }
};

// [SỬA 4] Kết nối API DELETE /delete/:MaNhanVien
export const deleteNhanVien = async (maNV: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${maNV}`, { // BE dùng /delete/:MaNhanVien
      method: 'DELETE',
    });
    await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    throw error;
  }
};