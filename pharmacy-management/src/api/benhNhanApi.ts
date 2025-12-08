// src/api/benhNhanApi.ts
import { BenhNhan } from '../interfaces';


const API_BASE_URL = '/api/v1/benhnhan';


export const getPatients = async (): Promise<BenhNhan[]> => {
  const response = await fetch(API_BASE_URL); // Gọi GET /api/v1/benhnhan
  if (!response.ok) {
    throw new Error('Không thể tải danh sách bệnh nhân');
  }
  return await response.json();
};


export const updatePatient = async (maBenhNhan: string, data: Partial<BenhNhan>): Promise<BenhNhan> => {
  
 
  const dataForBackend = {
    MaBenhNhan: maBenhNhan,          
    TenBenhNhan: data.TenBenhNhan,  
    NgaySinh: data.NgaySinh,         
    GioiTinh: data.GioiTinh,         
    SoDienThoai: data.SoDienThoai,   
    DiaChi: data.DiaChi              
  };

  // BE  dùng route "/fix"
  const response = await fetch(`${API_BASE_URL}/fix`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // Gửi dữ liệu đã "dịch" (camelCase)
    body: JSON.stringify(dataForBackend), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật thất bại');
  }
  
  const result = await response.json();
  
  return { ...data, MaBenhNhan: maBenhNhan } as BenhNhan;
};


export const deletePatient = async (maBenhNhan: string): Promise<void> => {
  // BE của bạn dùng "/delete/:maBenhNhan"
  const response = await fetch(`${API_BASE_URL}/delete/${maBenhNhan}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Xóa thất bại');
  }
};

/**
 * Hàm thêm (Tạm thời vô hiệu hóa)
 */
export const addPatient = async (benhNhanData: Omit<BenhNhan, 'MaBenhNhan'>): Promise<BenhNhan> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(benhNhanData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Thêm bệnh nhân thất bại');
  }

  
  const result = await response.json(); 
  
  // Trả về object BenhNhan hoàn chỉnh
  return {
    ...benhNhanData,
    MaBenhNhan: result.MaBenhNhan
  } as BenhNhan;
};
export const findPatientByPhone = async (sdt: string): Promise<{ found: boolean, data?: BenhNhan }> => {
  const response = await fetch(`${API_BASE_URL}/tim-kiem/${sdt}`);
  if (!response.ok) {
    throw new Error('Lỗi khi gọi API tìm kiếm');
  }
  return await response.json();
};