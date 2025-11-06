// src/api/thuocApi.ts
import { Thuoc } from '../interfaces';

const API_BASE_URL = '/api/v1/thuoc';

/**
 * Hàm chung để xử lý response từ fetch
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Thử đọc lỗi dưới dạng JSON trước
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
    } catch (jsonError) {
      // Nếu thất bại (vì response là HTML/Text), đọc dưới dạng text
      const errorText = await response.text();
      // Ném lỗi này (có thể là lỗi HTML 404 hoặc 500)
      throw new Error(errorText || 'Lỗi không xác định');
    }
  }
  return response.json();
};

/**
 * Lấy danh sách thuốc (Giữ nguyên)
 */
export const getMedicines = async (): Promise<Thuoc[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);
    const data = await handleResponse(response);
    return data as Thuoc[]; 
  } catch (error) {
    console.error('Lỗi khi tải danh sách thuốc:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Thêm thuốc
 */
export const addMedicine = async (thuocData: Partial<Thuoc>): Promise<Thuoc> => {
  // [SỬA LỖI Ở ĐÂY] "Dịch" từ PascalCase (FE) sang camelCase (BE yêu cầu)
  const dataForBackend = {
    tenThuoc: thuocData.TenThuoc,
    donViTinh: thuocData.DonViTinh,
    soLuongTon: thuocData.SoLuongTon,
    giaNhap: thuocData.GiaNhap,
    giaBan: thuocData.GiaBan,
    hanSuDung: thuocData.HanSuDung,
    ngayNhap: thuocData.NgayNhap,
    maLoai: thuocData.MaLoai,
    nhaCungCap: thuocData.NhaCungCap,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataForBackend), // Gửi dữ liệu đã "dịch"
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi thêm thuốc:', error);
    throw error;
  }
};

/**
 * [ĐÃ SỬA] Cập nhật thuốc
 */
export const updateMedicine = async (maThuoc: string, data: Partial<Thuoc>): Promise<Thuoc> => {
  // [SỬA LỖI Ở ĐÂY] "Dịch" từ PascalCase (FE) sang camelCase (BE yêu cầu)
  const dataForBackend = {
    maThuoc: maThuoc, // BE (thuoc.js) cũng cần maThuoc trong body
    tenThuoc: data.TenThuoc,
    donViTinh: data.DonViTinh,
    soLuongTon: data.SoLuongTon,
    giaNhap: data.GiaNhap,
    giaBan: data.GiaBan,
    hanSuDung: data.HanSuDung,
    ngayNhap: data.NgayNhap,
    maLoai: data.MaLoai,
    nhaCungCap: data.NhaCungCap,
  };

  try {
    // BE (thuoc.js) dùng đường dẫn /fix
    const response = await fetch(`${API_BASE_URL}/fix`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataForBackend), // Gửi dữ liệu đã "dịch"
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi cập nhật thuốc:', error);
    throw error;
  }
};

/**
 * Xóa thuốc (Giữ nguyên)
 */
export const deleteMedicine = async (maThuoc: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${maThuoc}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi xóa thuốc:', error);
    throw error;
  }
};