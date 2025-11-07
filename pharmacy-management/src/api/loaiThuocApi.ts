// src/api/loaiThuocApi.ts
import { LoaiThuoc } from '../interfaces';

// [CHỜ BE] Thay đổi URL này khi BE cung cấp
const API_BASE_URL = '/api/v1/loaithuoc'; 

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
 * [CHỜ BE] Lấy danh sách loại thuốc
 */
export const getLoaiThuoc = async (): Promise<LoaiThuoc[]> => {
  try {
    // Tạm thời ném lỗi chờ BE
    throw new Error("API (getLoaiThuoc) chưa được kết nối!");
    
    // const response = await fetch(`${API_BASE_URL}/list`);
    // const data = await handleResponse(response);
    // return data as LoaiThuoc[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách loại thuốc:', error);
    throw error;
  }
};

/**
 * [CHỜ BE] Thêm loại thuốc
 */
export const addLoaiThuoc = async (data: Partial<LoaiThuoc>): Promise<LoaiThuoc> => {
   try {
    throw new Error("API (addLoaiThuoc) chưa được kết nối!");
    
    // const response = await fetch(`${API_BASE_URL}/add`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm loại thuốc:', error);
    throw error;
  }
};

// ... (Tương tự cho updateLoaiThuoc và deleteLoaiThuoc)