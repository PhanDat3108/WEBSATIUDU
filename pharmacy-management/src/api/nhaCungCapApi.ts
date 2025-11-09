// src/api/nhaCungCapApi.ts
import { NhaCungCap } from '../interfaces';

// [GIỮ NGUYÊN] URL này đã đúng theo file server.js
const API_BASE_URL = 'http://localhost:8080/api/v1/nhacungcap'; 

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
 * [ĐÃ SỬA] Lấy danh sách nhà cung cấp (cho bảng quản lý)
 * Kết nối với: GET /api/v1/nhacungcap/list
 */
export const getNhaCungCap = async (): Promise<NhaCungCap[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);
    const data = await handleResponse(response);
    return data as NhaCungCap[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách NCC:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Lấy danh sách tên NCC (cho dropdown)
 * Kết nối với: GET /api/v1/nhacungcap/listname
 */
export const getNhaCungCapListname = async (): Promise<Pick<NhaCungCap, 'MaNhaCungCap' | 'TenNhaCungCap'>[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/listname`);
    const data = await handleResponse(response);
    return data as NhaCungCap[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách tên NCC:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Thêm nhà cung cấp
 * Kết nối với: POST /api/v1/nhacungcap/add
 */
export const addNhaCungCap = async (data: Partial<NhaCungCap>): Promise<NhaCungCap> => {
   try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm NCC:', error);
    throw error;
  }
};

/**
 * [MỚI] Cập nhật nhà cung cấp
 * Kết nối với: PUT /api/v1/nhacungcap/fix
 */
export const updateNhaCungCap = async (maNhaCungCap: string, data: Partial<NhaCungCap>): Promise<NhaCungCap> => {
   try {
    const response = await fetch(`${API_BASE_URL}/fix`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Gửi cả MaNhaCungCap trong body theo yêu cầu của BE
      body: JSON.stringify({ ...data, MaNhaCungCap: maNhaCungCap }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật NCC:', error);
    throw error;
  }
};

/**
 * [MỚI] Xóa nhà cung cấp
 * Kết nối với: DELETE /api/v1/nhacungcap/delete/:id
 */
export const deleteNhaCungCap = async (maNhaCungCap: string): Promise<any> => {
   try {
    const response = await fetch(`${API_BASE_URL}/delete/${maNhaCungCap}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi xóa NCC:', error);
    throw error;
  }
};