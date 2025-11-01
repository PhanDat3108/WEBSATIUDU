// src/api/thuocApi.ts
import { Thuoc } from '../interfaces';

// Đường dẫn này khớp với server.js (Bước 1) và proxy (Bước 2)
const API_BASE_URL = '/api/v1/thuoc';

/**
 * Hàm chung để xử lý response từ fetch
 */
const handleResponse = async (response: Response) => {
  // Nếu response không OK (lỗi 400, 500...), ném ra lỗi
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
  }
  // Nếu OK, trả về data
  return response.json();
};

/**
 * Lấy danh sách thuốc (Kết nối với GET /list)
 */
export const getMedicines = async (): Promise<Thuoc[]> => {
  console.log('GỌI API: getMedicines (Kết nối API thật)');
  
  try {
    // 1. Gọi API /api/v1/thuoc/list
    const response = await fetch(`${API_BASE_URL}/list`);
    const data = await handleResponse(response);
    
    // 2. Backend trả về mảng, ta gõ kiểu cho nó
    return data as Thuoc[]; 
  } catch (error) {
    console.error('Lỗi khi tải danh sách thuốc:', error);
    throw error;
  }
};

/**
 * Thêm thuốc mới (Kết nối với POST /add)
 */
export const addMedicine = async (thuocData: any): Promise<Thuoc> => {
  console.log('GỌI API: addMedicine (Kết nối API thật)', thuocData);

  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thuocData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm thuốc:', error);
    throw error;
  }
};

/**
 * Cập nhật thuốc (Kết nối với PUT /edit/:maThuoc)
 */
export const updateMedicine = async (maThuoc: string, data: any): Promise<Thuoc> => {
  console.log('GỌI API: updateMedicine (Kết nối API thật)', maThuoc, data);

  try {
    const response = await fetch(`${API_BASE_URL}/edit/${maThuoc}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật thuốc:', error);
    throw error;
  }
};

/**
 * Xóa thuốc (Kết nối với DELETE /delete/:maThuoc)
 */
export const deleteMedicine = async (maThuoc: string): Promise<void> => {
  console.log('GỌI API: deleteMedicine (Kết nối API thật)', maThuoc);

  try {
    const response = await fetch(`${API_BASE_URL}/delete/${maThuoc}`, {
      method: 'DELETE',
    });
    // API xóa thường trả về message, không phải data
    await handleResponse(response); 
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    throw error;
  }
};