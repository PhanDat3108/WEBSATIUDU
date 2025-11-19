// backend/routes/donthuoc.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API: TẠO ĐƠN THUỐC (BÁN HÀNG) + TỰ TẠO PHIẾU XUẤT
router.post("/create", async (req, res) => {
  const { MaNhanVien, MaBenhNhan, chiTiet } = req.body;

  // Validation
  if (!MaNhanVien || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn thuốc không hợp lệ" });
  }

  const conn = db.promise();

  const rollback = async (msg, error) => {
    if(conn) await conn.rollback();
    console.error(msg, error);
    res.status(500).json({ message: msg, error: error?.message });
  };

  try {
    await conn.beginTransaction();

    // 1. Tính tổng tiền
    const TongTien = chiTiet.reduce((sum, item) => sum + (Number(item.SoLuong) * Number(item.GiaBan)), 0);
    const NgayLap = new Date();

    // 2. Tạo Mã Phiếu Xuất (PX...)
    const [pxRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
    const nextPxId = (pxRes[0].maxId || 0) + 1;
    const MaPhieuXuat = "PX" + String(nextPxId).padStart(3, "0");

    // 3. Insert Phiếu Xuất (Loại 'Bán') -> QUAN TRỌNG: Đánh dấu là Bán hàng
    await conn.query(
      "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, ?, ?, ?, 'Bán')",
      [MaPhieuXuat, NgayLap, TongTien, MaNhanVien]
    );

    // 4. Tạo Mã Đơn Thuốc (DT...)
    const [dtRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaDonThuoc, 3) AS UNSIGNED)) AS maxId FROM DonThuoc");
    const nextDtId = (dtRes[0].maxId || 0) + 1;
    const MaDonThuoc = "DT" + String(nextDtId).padStart(3, "0");

    // 5. Insert Đơn Thuốc (Liên kết với MaPhieuXuat vừa tạo)
    await conn.query(
      "INSERT INTO DonThuoc (MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan, MaNhanVien) VALUES (?, ?, ?, ?, ?, ?)",
      [MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan || null, MaNhanVien] // MaBenhNhan có thể null
    );

    // 6. Xử lý từng thuốc (Trừ kho FEFO & Lưu chi tiết)
    for (const item of chiTiet) {
        const maThuoc = item.MaThuoc;
        const soLuongCanBan = Number(item.SoLuong);
        const donGiaBan = Number(item.GiaBan);

        // 6.1. Tìm lô hàng để trừ (FEFO)
        const [loHang] = await conn.query(
            "SELECT MaPhieuNhap, SoLuongConLai, DonGiaNhap FROM ChiTietNhap WHERE MaThuoc = ? AND SoLuongConLai > 0 ORDER BY HanSuDung ASC",
            [maThuoc]
        );

        let soLuongCanLay = soLuongCanBan;
        
        // Check tổng tồn
        const tongTonKhaDung = loHang.reduce((sum, lo) => sum + Number(lo.SoLuongConLai), 0);
        if (tongTonKhaDung < soLuongCanLay) {
            throw new Error(`Thuốc ${maThuoc} không đủ hàng (Còn: ${tongTonKhaDung}, Cần: ${soLuongCanLay})`);
        }

        // 6.2. Trừ kho từng lô và Lưu ChiTietXuat
        for (const lo of loHang) {
            if (soLuongCanLay === 0) break;
            const slConLaiTrongLo = Number(lo.SoLuongConLai);
            const layTuLonay = Math.min(slConLaiTrongLo, soLuongCanLay);
            
            // Trừ số lượng lô này
            await conn.query(
                "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
                [layTuLonay, lo.MaPhieuNhap, maThuoc]
            );

            // Lưu vào ChiTietXuat (Dùng giá vốn - DonGiaNhap)
            await conn.query(
                "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES (?, ?, ?, ?)",
                [MaPhieuXuat, maThuoc, layTuLonay, lo.DonGiaNhap] 
            );

            soLuongCanLay -= layTuLonay;
        }

        // 6.3. Lưu vào ChiTietDonThuoc (Dùng giá bán thực tế)
        await conn.query(
            "INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, SoLuong, DonGiaBan) VALUES (?, ?, ?, ?)",
            [MaDonThuoc, maThuoc, soLuongCanBan, donGiaBan]
        );

        // 6.4. Cập nhật tổng tồn kho bảng Thuoc
        await conn.query(
            "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
            [soLuongCanBan, maThuoc]
        );
    }

    await conn.commit();
    res.status(201).json({ 
        message: "Xuất đơn thuốc thành công!", 
        MaDonThuoc, 
        MaPhieuXuat,
        TongTien 
    });

  } catch (err) {
    await rollback("Lỗi khi tạo đơn thuốc", err);
  }
});

// API Lấy lịch sử đơn thuốc
router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT 
                dt.MaDonThuoc, dt.NgayLap, dt.TongTien, dt.MaPhieuXuat,
                bn.TenBenhNhan, bn.SoDienThoai,
                nv.TenNhanVien
            FROM DonThuoc dt
            LEFT JOIN BenhNhan bn ON dt.MaBenhNhan = bn.MaBenhNhan
            LEFT JOIN NhanVien nv ON dt.MaNhanVien = nv.MaNhanVien
            ORDER BY dt.NgayLap DESC
        `;
        const [rows] = await db.promise().query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({message: "Lỗi tải danh sách đơn thuốc"});
    }
});

export default router;