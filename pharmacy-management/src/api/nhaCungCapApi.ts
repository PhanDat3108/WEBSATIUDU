// src/api/nhaCungCapApi.ts
import { NhaCungCap } from '../interfaces';

// [CHỜ BE] Thay đổi URL này khi BE cung cấp
const API_BASE_URL = '/api/v1/nhacungcap'; 

/**
 * Hàm chung xử lý response (sao chép từ thuocApi.ts)
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      const errorText = await response.text();
      throw new Error(errorText || 'Lỗi không xác định');
    }
  }
  return response.json();
};

/**
 * [CHỜ BE] Lấy danh sách nhà cung cấp
 */
export const getNhaCungCap = async (): Promise<NhaCungCap[]> => {
  try {
    // Tạm thời ném lỗi chờ BE
    throw new Error("API (getNhaCungCap) chưa được kết nối!");
    
    // const response = await fetch(`${API_BASE_URL}/list`);
    // const data = await handleResponse(response);
    // return data as NhaCungCap[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách NCC:', error);
    throw error;
  }
};

/**
 * [CHỜ BE] Thêm nhà cung cấp
 */
export const addNhaCungCap = async (data: Partial<NhaCungCap>): Promise<NhaCungCap> => {
   try {
    throw new Error("API (addNhaCungCap) chưa được kết nối!");
    
    // const response = await fetch(`${API_BASE_URL}/add`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm NCC:', error);
    throw error;
  }
};

// ... (Tương tự cho updateNhaCungCap và deleteNhaCungCap)