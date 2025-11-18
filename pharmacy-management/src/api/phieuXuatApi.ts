// src/api/phieuXuatApi.ts
import { PhieuXuat } from '../interfaces';

const API_BASE_URL = '/api/v1/phieuxuat';

// 1. Định nghĩa các Interface dữ liệu gửi đi
export interface ChiTietXuatPayload {
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;
}

export interface PhieuXuatPayload {
  MaNhanVien: string;
  LoaiXuat: string;
  TongTien: number;
  chiTiet: ChiTietXuatPayload[];
}

// 2. Hàm xử lý phản hồi (Copy logic từ thuocApi.ts của bạn sang cho nhất quán)
const handleResponse = async (response: Response) => {
  const responseBodyAsText = await response.text();

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseBodyAsText);
      throw new Error(errorData.message || 'Lỗi từ server');
    } catch (e) {
      throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
    }
  }

  try {
    return JSON.parse(responseBodyAsText);
  } catch (e) {
    if (responseBodyAsText.trim() === "") return {};
    return responseBodyAsText;
  }
};

// 3. Xuất ra object chứa các hàm gọi API
export const phieuXuatApi = {
  // Hàm lấy danh sách phiếu xuất (nếu cần)
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi lấy danh sách phiếu xuất:', error);
      throw error;
    }
  },

  // [QUAN TRỌNG] Hàm tạo phiếu xuất - Nút "Xuất đơn thuốc" sẽ gọi hàm này
  create: async (data: PhieuXuatPayload) => {
    // Lấy token từ localStorage để gửi kèm (nếu Backend yêu cầu bảo mật)
    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Nếu BE cần xác thực thì bỏ comment dòng dưới:
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi tạo phiếu xuất:', error);
      throw error;
    }
  },
};