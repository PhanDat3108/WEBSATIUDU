// src/api/phieuXuatApi.ts
import { PhieuXuatPayload, XuatNoiBoHistory } from '../interfaces'; 

const API_BASE_URL = '/api/v1/phieuxuat';

const handleResponse = async (response: Response) => {
  const text = await response.text();
  if (!response.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.message || response.statusText);
    } catch (e) {
      throw new Error(text || response.statusText);
    }
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const phieuXuatApi = {
  // Lấy toàn bộ danh sách chi tiết (Dùng cho bảng XuatNoiBoManagement)
  getAllDetails: async (): Promise<XuatNoiBoHistory[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/details-all`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi lấy danh sách phiếu xuất:', error);
      throw error;
    }
  },

  // Hàm tạo phiếu xuất Bán hàng (Dùng cho TuiHangSidebar)
  create: async (data: PhieuXuatPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      throw error;
    }
  },
};