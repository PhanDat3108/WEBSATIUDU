// src/interfaces/index.ts


/**
 * 1.1. Thuốc (Medicine)
 */
export interface Thuoc {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  SoLuongTon: number;
  GiaNhap: number;
  GiaBan: number;
  MaNhaCungCap: string; // Khóa ngoại
  MaLoai: string; // Khóa ngoại

  TenLoai?: string;
  TenNhaCungCap?: string;
  HinhAnh?: string;
}

/**
 * 1.2. Loại thuốc (LoaiThuoc)
 */
export interface LoaiThuoc {
  MaLoai: string;
  TenLoai: string;
}

/**
 * 1.3. Nhà cung cấp (NhaCungCap)
 */
export interface NhaCungCap {
  MaNhaCungCap: string;
  TenNhaCungCap: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
}

/**
 * 1.4. Phiếu nhập (PhieuNhap)
 */
export interface PhieuNhap {
  MaPhieuNhap: string;
  NgayNhap: string;
  TongTien: number;
  MaNhaCungCap: string; // Khóa ngoại
  MaNhanVien: string; // Khóa ngoại

  // Dữ liệu lồng
  ChiTietNhap?: ChiTietNhap[];
}

/**
 * 1.5. Chi tiết phiếu nhập (ChiTietNhap)

 */
export interface ChiTietNhap {
  MaPhieuNhap: string;
  MaThuoc: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; 

  // Dữ liệu join từ BE
  TenThuoc?: string;
}
export interface ChiTietNhapLichSu {
  MaPhieuNhap: string;
  NgayNhap: string;      
  TenThuoc: string;
  TenNhaCungCap: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; 
SoLuongConLai: number;  }
  export interface ChiTietNhapCreate {
  MaThuoc: string;
  SoLuongNhap: number;
  DonGiaNhap: number;
  HanSuDung: string; 

}

export interface PhieuNhapCreatePayload {
  MaNhaCungCap: string;
  MaNhanVien: string;
  chiTiet: ChiTietNhapCreate[];
}

export interface PhieuXuat {
  MaPhieuXuat: string;
  NgayXuat: string;
  TongTien: number;
  MaNhanVien: string; // Khóa ngoại
  LoaiXuat: string; 

  // Dữ liệu lồng
  ChiTietXuat?: ChiTietXuat[];
}

/**
 * 1.7. Chi tiết phiếu xuất (ChiTietXuat)
 */
export interface ChiTietXuat {
  MaPhieuXuat: string;
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;

  
  TenThuoc?: string;
}

/**
 * 1.8. Nhân viên (NhanVien)
 */


export interface NhanVien {
  MaNhanVien: string;
  TenNhanVien: string;
  TaiKhoan: string;
  VaiTro: string;
}


export interface NhanVienCreateData {
  TenNhanVien: string;
  TaiKhoan: string;
  MatKhau: string; 
  VaiTro: string;
}

// Dùng để GỬI DỮ LIỆU CẬP NHẬT (gửi lên BE)
export interface NhanVienUpdateData {
  TenNhanVien?: string;
  TaiKhoan?: string;
  VaiTro?: string;
  // Không bao gồm MatKhau ở đây
}

/**
 * 1.9. Bệnh nhân (BenhNhan)
 */
export interface BenhNhan {
  MaBenhNhan: string;
  TenBenhNhan: string;
  NgaySinh: string;
  GioiTinh: string;
  SoDienThoai: string;
  DiaChi: string;
}

/**
 * 1.10. Đơn thuốc (DonThuoc)

 */
export interface DonThuoc {
  MaDonThuoc: string;
  MaPhieuXuat: string; 
  NgayLap: string;
  TongTien: number;
  MaBenhNhan: string; // Khóa ngoại
  MaNhanVien: string; // Khóa ngoại

  // Dữ liệu lồng
  ChiTietDonThuoc?: ChiTietDonThuoc[];
}

/**
 * 1.11. Chi tiết đơn thuốc (ChiTietDonThuoc)
 
 */
export interface ChiTietDonThuoc {
  MaDonThuoc: string;
  MaThuoc: string;
  SoLuong: number;
  DonGiaBan: number;

  // Dữ liệu join từ BE
  TenThuoc?: string;
}




/**
 * Dành cho Dashboard (Cảnh báo thuốc)
 * Lưu ý: 'HanSuDung' lấy từ 'ChiTietNhap' thay vì 'Thuoc'.
 */
export interface ThuocCanhBao {
  MaThuoc: string;
  TenThuoc: string;
  SoLuongTon: number;
  HanSuDung: string; 
  LyDo: 'SapHetHan' | 'SapHetHang';
}

/**
 * Dành cho Báo cáo Tồn kho
 */
export interface BaoCaoTonKho {
  TongSoLoaiThuoc: number;
  TongSoLuongTon: number;
  ThuocSapHetHan: Thuoc[];
  ThuocDaHetHan: Thuoc[];
  ThuocSapHetHang: Thuoc[];
}

/**
 * Dành cho Báo cáo Doanh thu
 */
export interface DuLieuDoanhThu {
  Thang: string;
  DoanhThu: number;
}
// src/interfaces/index.ts





/**
 * Dùng cho API Đăng nhập (Gửi lên BE)
 */
export interface LoginPayload {
  TaiKhoan: string;
  MatKhau: string;
}

/**
 * Dùng cho API Đăng nhập (Nhận từ BE)
 */
export interface LoginResponse {
  token: string;
  user: {
    MaNhanVien: string;
    TenNhanVien: string;
    VaiTro: string;
  };
}

/**
 * Dùng cho API Đăng ký 
 * (Tệp RegisterForm.tsx  cần 'RegisterPayload' này)
 */
export interface RegisterPayload {
  TenNhanVien: string;
  TaiKhoan: string;
  MatKhau: string;
  VaiTro: string;
}


export interface RegisterResponse {
  message: string;
  MaNhanVien: string;
}
/**
 * 1.15. Dữ liệu cho Lịch sử Xuất Nội Bộ (Bỏ/Khác)
 */
export interface XuatNoiBoHistory {
  MaPhieuXuat: string;
  NgayXuat: string; 
  LoaiXuat: string; 
  TenThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number;
  TenNhanVien: string;
}

/**
 * 1.16. Dữ liệu CHI TIẾT để TẠO phiếu xuất nội bộ
 */
export interface ChiTietXuatNoiBoCreate {
  MaThuoc: string;
  SoLuongXuat: number;
  DonGiaXuat: number; 
}

/**
 * 1.17. Dữ liệu TỔNG QUÁT để TẠO phiếu xuất nội bộ
 */
export interface PhieuXuatNoiBoCreatePayload {
  MaNhanVien: string;
  LoaiXuat: string; // Bỏ | Khác
  chiTiet: ChiTietXuatNoiBoCreate[];
}
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