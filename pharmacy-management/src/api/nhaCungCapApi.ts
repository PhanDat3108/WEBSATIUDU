// src/api/nhaCungCapApi.ts
import { NhaCungCap } from '../interfaces';


const API_BASE_URL = 'http://localhost:8080/api/v1/nhacungcap'; 

/**
 * Hàm chung xử lý response (giống loaiThuocApi.ts)
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text(); 
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      throw new Error(errorText || 'Lỗi không xác định');
    }
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return { success: true, message: "Hành động thành công" };
};

/**
 * [SỬA TÊN HÀM] Lấy danh sách nhà cung cấp (thay cho getNhaCungCapList)
 
 * Kết nối với: GET /api/v1/nhacungcap/list (Giả định như loaiThuoc)
 */
export const getNhaCungCap = async (): Promise<NhaCungCap[]> => {
  try {
    // Giả định backend cũng có endpoint /list như loaithuoc
    const response = await fetch(`${API_BASE_URL}/list`); 
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhà cung cấp:', error);
    throw error;
  }
};


/**
 * [MỚI] Thêm nhà cung cấp
 * Kết nối với: POST /api/v1/nhacungcap/add (Giả định như loaiThuoc)
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
    console.error('Lỗi khi thêm nhà cung cấp:', error);
    throw error;
  }
};

/**
 * [MỚI] Cập nhật nhà cung cấp
 * Kết nối với: PUT /api/v1/nhacungcap/fix (Giả định như loaiThuoc)
 */
export const updateNhaCungCap = async (maNhaCungCap: string, data: Partial<NhaCungCap>): Promise<NhaCungCap> => {
   try {
    const response = await fetch(`${API_BASE_URL}/fix`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Gửi cả mã trong body
      body: JSON.stringify({ ...data, MaNhaCungCap: maNhaCungCap }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật nhà cung cấp:', error);
    throw error;
  }
};

/**
 * [MỚI] Xóa nhà cung cấp
 * Kết nối với: DELETE /api/v1/nhacungcap/delete/:id (Giả định như loaiThuoc)
 */
export const deleteNhaCungCap = async (maNhaCungCap: string): Promise<any> => {
   try {
    const response = await fetch(`${API_BASE_URL}/delete/${maNhaCungCap}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi xóa nhà cung cấp:', error);
    throw error;
  }
};
// Giữ lại hàm cũ để tránh lỗi nếu có nơi khác đang dùng
export const getNhaCungCapList = async (): Promise<NhaCungCap[]> => {
  return getNhaCungCap();
}
export const getNhaCungCapListForDropdown = async (): Promise<Pick<NhaCungCap, 'MaNhaCungCap' | 'TenNhaCungCap'>[]> => {
  try {
    // Gọi đến endpoint '/'
    const response = await fetch(`${API_BASE_URL}/`);
    
    // Giữ nguyên logic handleResponse 
    const data = await handleResponse(response); 
    return data as NhaCungCap[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách tên nhà cung cấp:', error);
    throw error;
  }
};