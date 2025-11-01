// src/interfaces/index.ts

// Từ bảng LoaiThuoc
export interface LoaiThuoc {
  MaLoai: string;
  TenLoai: string;
}

// Từ bảng NhaCungCap
export interface NhaCungCap {
  MaNhaCungCap: string;
  TenNhaCungCap: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
}

// Từ bảng Thuoc
export interface Thuoc {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  SoLuongTon: number;
  GiaNhap: number;
  GiaBan: number;
  HanSuDung: string;
  NgayNhap: string;
  MaLoai: string;
  
  // LỖI CỦA BẠN CÓ THỂ Ở ĐÂY:
  // Tên cột trong database.sql của bạn là 'NhaCungCap', KHÔNG PHẢI 'MaNhaCungCap'
  NhaCungCap: string; 

  // Dữ liệu join từ BE
  TenLoai?: string;
  TenNhaCungCap?: string;
}

// Từ bảng BenhNhan
export interface BenhNhan {
  MaBenhNhan: string;
  TenBenhNhan: string;
  NgaySinh: string;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
}

// Từ bảng PhieuNhap
export interface PhieuNhap {
  MaPhieuNhap: string;
  NgayNhap: string;
  TongTien: number;
  MaNhanVien: string;
  MaNhaCungCap: string;
  ChiTietNhap?: ChiTietNhap[];
}

// Từ bảng ChiTietNhap
export interface ChiTietNhap {
  MaPhieuNhap: string;
  MaThuoc: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  TenThuoc?: string;
}

// Từ bảng PhieuXuat
export interface PhieuXuat {
  MaPhieuXuat: string;
  NgayXuat: string;
  TongTien: number;
  MaNhanVien: string;
  MaBenhNhan: string;
  ChiTietXuat?: ChiTietXuat[];
}

// Từ bảng ChiTietXuat
export interface ChiTietXuat {
  MaPhieuXuat: string;
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;
  TenThuoc?: string;
}

// Dành cho Dashboard
export interface ThuocCanhBao {
  MaThuoc: string;
  TenThuoc: string;
  SoLuongTon: number;
  HanSuDung: string;
  LyDo: 'SapHetHan' | 'SapHetHang';
}

// Dành cho Báo cáo
export interface BaoCaoTonKho {
  TongSoLoaiThuoc: number;
  TongSoLuongTon: number;
  ThuocSapHetHan: Thuoc[];
  ThuocDaHetHan: Thuoc[];
  ThuocSapHetHang: Thuoc[];
}

// Dành cho Doanh thu
export interface DuLieuDoanhThu {
  thang: string;
  doanhThu: number;
}
// Bổ sung: Từ bảng NhanVien
export interface NhanVien {
  MaNhanVien: string;
  TenNhanVien: string;
  TaiKhoan: string;
  MatKhau: string; // CHÚ Ý: Không nên truyền Mật khẩu thô (raw) qua API!
  VaiTro: string; // Ví dụ: 'Admin', 'NhanVienNhapXuat', v.v.
}