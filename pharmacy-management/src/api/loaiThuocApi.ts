// src/api/loaiThuocApi.ts
import { LoaiThuoc } from '../interfaces';

// [GIỮ NGUYÊN] URL này đã đúng theo file server.js
const API_BASE_URL = 'http://localhost:8080/api/v1/loaithuoc'; 

/**
 * Hàm chung xử lý response
 */
const handleResponse = async (response: Response) => {
  // Nếu KHÔNG OK (ví dụ 404, 500)
  if (!response.ok) {
    const errorText = await response.text(); // Chỉ đọc 1 lần bằng .text()
    try {
      // Thử xem text có phải là JSON không
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      // Nếu không phải JSON, ném lỗi text (thường là HTML 404)
      throw new Error(errorText || 'Lỗi không xác định');
    }
  }

  // Nếu OK (200)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return { success: true, message: "Hành động thành công" };
};

/**
 * [ĐÃ SỬA] Lấy danh sách loại thuốc (cho bảng quản lý)
 * Kết nối với: GET /api/v1/loaithuoc/list
 */
export const getLoaiThuoc = async (): Promise<LoaiThuoc[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);
    const data = await handleResponse(response);
    return data as LoaiThuoc[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách loại thuốc:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Lấy danh sách tên loại thuốc (cho dropdown)
 * Kết nối với: GET /api/v1/loaithuoc/listname
 */
export const getLoaiThuocListname = async (): Promise<Pick<LoaiThuoc, 'MaLoai' | 'TenLoai'>[]> => {
  try {
    // [SỬA CHÍNH] Sửa '/listname' thành '/' để khớp với file loaithuoc.js
    const response = await fetch(`${API_BASE_URL}/`);
    
    // Giữ nguyên logic handleResponse của bạn
    const data = await handleResponse(response); 
    return data as LoaiThuoc[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách tên loại thuốc:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Thêm loại thuốc
 * Kết nối với: POST /api/v1/loaithuoc/add
 */
export const addLoaiThuoc = async (data: Partial<LoaiThuoc>): Promise<LoaiThuoc> => {
   try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm loại thuốc:', error);
    throw error;
  }
};

/**
 * [MỚI] Cập nhật loại thuốc
 * Kết nối với: PUT /api/v1/loaithuoc/fix
 */
export const updateLoaiThuoc = async (maLoai: string, data: Partial<LoaiThuoc>): Promise<LoaiThuoc> => {
   try {
    const response = await fetch(`${API_BASE_URL}/fix`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Gửi cả MaLoai trong body theo yêu cầu của BE
      body: JSON.stringify({ ...data, MaLoai: maLoai }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật loại thuốc:', error);
    throw error;
  }
};

/**
 * [MỚI] Xóa loại thuốc
 * Kết nối với: DELETE /api/v1/loaithuoc/delete/:id
 */
export const deleteLoaiThuoc = async (maLoai: string): Promise<any> => {
   try {
    const response = await fetch(`${API_BASE_URL}/delete/${maLoai}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi xóa loại thuốc:', error);
    throw error;
  }
};

