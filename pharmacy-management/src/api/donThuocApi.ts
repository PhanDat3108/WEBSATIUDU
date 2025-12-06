// src/api/donThuocApi.ts

// Định nghĩa dữ liệu gửi đi (Input)
export interface CreateDonThuocPayload {
  MaNhanVien: string;
  MaBenhNhan: string | null; // Backend cho phép null nếu là khách vãng lai
  chiTiet: {
    MaThuoc: string;
    SoLuong: number;
    GiaBan: number;
  }[];
}

// Định nghĩa dữ liệu nhận về (Output từ backend donthuoc.js)
export interface CreateDonThuocResponse {
  message: string;
  MaDonThuoc: string;  
  MaPhieuXuat: string; // <-- Backend cũng tự tạo cái này
  TongTien: number;
}

const API_BASE_URL = '/api/v1/donthuoc';

export const createDonThuoc = async (data: CreateDonThuocPayload): Promise<CreateDonThuocResponse> => {
  // Gọi vào route router.post("/create", ...) bên backend
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();
  
  if (!response.ok) {

    try {
      const err = JSON.parse(text);
      throw new Error(err.message || 'Lỗi tạo đơn thuốc');
    } catch (e: any) {
      throw new Error(text || e.message || 'Lỗi kết nối server');
    }
  }

  // Trả về kết quả (bao gồm MaDonThuoc vừa tạo)
  return JSON.parse(text);
};