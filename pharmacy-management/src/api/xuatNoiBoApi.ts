// src/api/xuatNoiBoApi.ts
import { PhieuXuatNoiBoCreatePayload } from '../interfaces';

const API_BASE_URL = '/api/v1/xuatnoibo';

const handleResponse = async (response: Response) => {
  const text = await response.text();
  if (!response.ok) {
    const errorMsg = text ? JSON.parse(text).message : response.statusText;
    throw new Error(errorMsg);
  }
  return JSON.parse(text);
};

// API: Thêm phiếu xuất nội bộ (Bỏ/Khác)
// Hàm này sẽ được gọi từ XuatNoiBoForm
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