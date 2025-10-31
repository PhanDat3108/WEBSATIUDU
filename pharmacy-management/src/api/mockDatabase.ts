import { Medicine, Patient, Transaction } from '../interfaces';

// === DATABASE GIẢ 1: THUỐC ===
// Giả sử hôm nay là 31/10/2025
export const mockMedicines: Medicine[] = [
    // 1. Thuốc tốt
    { id: 1, stt: 1, maThuoc: 'PARA100', tenThuoc: 'Paracetamol 500mg', loaiThuoc: 'Giảm đau, hạ sốt', soLuong: 150, hsd: '2026-10-30', nhaCungCap: 'Traphaco', ngayNhap: '2024-10-30', giaBan: 1000 },
    // 2. Thuốc tốt
    { id: 2, stt: 2, maThuoc: 'AMO500', tenThuoc: 'Amoxicillin 500mg', loaiThuoc: 'Kháng sinh', soLuong: 80, hsd: '2027-05-15', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-05-15', giaBan: 5000 },
    // 3. Thuốc sắp hết hàng (Low stock)
    { id: 3, stt: 3, maThuoc: 'VITC100', tenThuoc: 'Vitamin C 100mg', loaiThuoc: 'Vitamin', soLuong: 15, hsd: '2027-01-20', nhaCungCap: 'Traphaco', ngayNhap: '2024-01-20', giaBan: 500 },
    // 4. Thuốc sắp hết hạn (Expiring soon < 90 days)
    // HSD: 15/12/2025 (còn ~45 ngày)
    { id: 4, stt: 4, maThuoc: 'BERG10', tenThuoc: 'Berberin 10mg', loaiThuoc: 'Tiêu hóa', soLuong: 50, hsd: '2025-12-15', nhaCungCap: 'Nam Hà', ngayNhap: '2024-12-01', giaBan: 2000 },
    // 5. Thuốc tốt
    { id: 5, stt: 5, maThuoc: 'OPI05', tenThuoc: 'Omeprazol 20mg', loaiThuoc: 'Dạ dày', soLuong: 120, hsd: '2026-08-01', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-08-01', giaBan: 3000 },
    // 6. Thuốc đã hết hạn (Expired)
    { id: 6, stt: 6, maThuoc: 'ASP100', tenThuoc: 'Aspirin 100mg', loaiThuoc: 'Chống đông máu', soLuong: 40, hsd: '2025-01-01', nhaCungCap: 'Traphaco', ngayNhap: '2024-01-01', giaBan: 1500 },
    // 7. Thuốc tốt
    { id: 7, stt: 7, maThuoc: 'SALB02', tenThuoc: 'Salbutamol 2mg', loaiThuoc: 'Hô hấp', soLuong: 70, hsd: '2027-02-01', nhaCungCap: 'Hậu Giang', ngayNhap: '2024-08-01', giaBan: 2500 },
];

// === DATABASE GIẢ 2: BỆNH NHÂN ===
export const mockPatients: Patient[] = [
    { id: 1, stt: 1, maBenhNhan: 'BN001', tenBenhNhan: 'Nguyễn Văn A', gioiTinh: 'Nam', tuoi: 30, diaChi: '123 Đường ABC, Q.1, TP.HCM', sdt: '0909123456', tienSuBenhAn: 'Tiểu đường type 2' },
    { id: 2, stt: 2, maBenhNhan: 'BN002', tenBenhNhan: 'Trần Thị B', gioiTinh: 'Nữ', tuoi: 45, diaChi: '456 Đường XYZ, Hà Nội', sdt: '0987654321', tienSuBenhAn: 'Cao huyết áp' },
    { id: 3, stt: 3, maBenhNhan: 'BN003', tenBenhNhan: 'Lê Văn C', gioiTinh: 'Nam', tuoi: 22, diaChi: '789 Đường LMN, Đà Nẵng', sdt: '0123456789', tienSuBenhAn: 'Viêm xoang' },
];

// === DATABASE GIẢ 3: GIAO DỊCH (THU NHẬP) ===
// Dùng để tính toán cho trang Revenue.tsx
export const mockTransactions: Transaction[] = [
    { id: 1, ngayBan: '2025-10-01', maThuoc: 'PARA100', soLuongBan: 10, tongTien: 10000 },
    { id: 2, ngayBan: '2025-10-05', maThuoc: 'AMO500', soLuongBan: 5, tongTien: 25000 },
    { id: 3, ngayBan: '2025-10-15', maThuoc: 'VITC100', soLuongBan: 20, tongTien: 10000 },
    { id: 4, ngayBan: '2025-10-30', maThuoc: 'PARA100', soLuongBan: 30, tongTien: 30000 }, // Hôm nay
    { id: 5, ngayBan: '2025-10-31', maThuoc: 'OPI05', soLuongBan: 10, tongTien: 30000 }, // Hôm nay
];