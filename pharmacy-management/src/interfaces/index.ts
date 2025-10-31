// Định nghĩa cấu trúc dữ liệu Medicine
export interface Medicine {
  id: number;
  stt: number;
  maThuoc: string;
  tenThuoc: string;
  loaiThuoc: string;
  soLuong: number;
  hsd: string;
  nhaCungCap: string;
  ngayNhap: string;
}

// [MỚI] Định nghĩa cấu trúc dữ liệu Patient
export interface Patient {
  id: number;
  stt: number;
  maBenhNhan: string;
  tenBenhNhan: string;
  gioiTinh: 'Nam' | 'Nữ';
  tuoi: number;
  diaChi: string;
  sdt: string;
  tienSuBenhAn: string; // Thêm từ form
}