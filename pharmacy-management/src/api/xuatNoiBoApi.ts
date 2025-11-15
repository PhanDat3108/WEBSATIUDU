// src/api/xuatNoiBoApi.ts
import { XuatNoiBoHistory, PhieuXuatNoiBoCreatePayload } from '../interfaces';

const API_BASE_URL = '/api/v1/xuatnoibo'; // Khớp với server.js

// Copy hàm handleResponse từ file api khác (ví dụ: thuocApi.ts)
const handleResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    if (!response.ok) {
      throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
    }
    return null;
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    if (!response.ok) {
      throw new Error(text); 
    }
    return text;
  }
  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra từ server');
  }
  return data;
};

/**
 * API 1: Lấy lịch sử chi tiết xuất nội bộ (Bỏ/Khác)
 */
export const getXuatNoiBoHistory = async (): Promise<XuatNoiBoHistory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/details`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi tải lịch sử xuất nội bộ:', error);
    throw error;
  }
};

/**
 * API 2: Thêm phiếu xuất nội bộ mới (Bỏ/Khác)
 */
export const addXuatNoiBo = async (payload: PhieuXuatNoiBoCreatePayload): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm phiếu xuất nội bộ:', error);
    throw error;
  }
};