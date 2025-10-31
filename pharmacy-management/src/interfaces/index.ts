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
  giaBan: number;
}

// Định nghĩa cấu trúc dữ liệu Patient
export interface Patient {
  id: number;
  stt: number;
  maBenhNhan: string;
  tenBenhNhan: string;
  gioiTinh: 'Nam' | 'Nữ';
  tuoi: number;
  diaChi: string;
  sdt: string;
  tienSuBenhAn: string; 
}

// Định nghĩa giao dịch (cho trang Thu nhập)
export interface Transaction {
    id: number;
    ngayBan: string; 
    maThuoc: string;
    soLuongBan: number;
    tongTien: number;
}

// [MỚI] Định nghĩa Báo cáo Hạn sử dụng
// (Di chuyển từ dashboardApi.ts sang đây)
export interface ExpiryReport {
    expired: number;
    expiringSoon: number; // 90 ngày
    good: number;
}