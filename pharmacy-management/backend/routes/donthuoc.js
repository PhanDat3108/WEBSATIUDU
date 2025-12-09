// backend/routes/donthuoc.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API: TẠO ĐƠN THUỐC (BÁN HÀNG) + TỰ TẠO PHIẾU XUẤT
router.post("/create", async (req, res) => {
  const { MaNhanVien, MaBenhNhan, chiTiet } = req.body;

  // 1. Validation
  if (!MaNhanVien || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn thuốc không hợp lệ" });
  }

  // --- SỬA Ở ĐÂY ---
  // Vì db.js dùng createConnection, ta dùng db.promise() trực tiếp để hỗ trợ async/await/transaction
  // Không dùng .getConnection() nữa.
  const conn = db.promise();

  try {
    // 2. Bắt đầu Transaction trên kết nối chính
    await conn.beginTransaction();

    // --- Tính toán dữ liệu chung ---
    const TongTien = chiTiet.reduce((sum, item) => sum + (Number(item.SoLuong) * Number(item.GiaBan)), 0);
    const NgayLap = new Date();

    // 3. Tạo Mã Phiếu Xuất (PX...)
    const [pxRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
    const nextPxId = (pxRes[0].maxId || 0) + 1;
    const MaPhieuXuat = "PX" + String(nextPxId).padStart(3, "0");

    // 4. Insert Phiếu Xuất
    await conn.query(
      "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, ?, ?, ?, 'Bán')",
      [MaPhieuXuat, NgayLap, TongTien, MaNhanVien]
    );

    // 5. Tạo Mã Đơn Thuốc (DT...)
    const [dtRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaDonThuoc, 3) AS UNSIGNED)) AS maxId FROM DonThuoc");
    const nextDtId = (dtRes[0].maxId || 0) + 1;
    const MaDonThuoc = "DT" + String(nextDtId).padStart(3, "0");

    // 6. Insert Đơn Thuốc
    await conn.query(
      "INSERT INTO DonThuoc (MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan, MaNhanVien) VALUES (?, ?, ?, ?, ?, ?)",
      [MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan || null, MaNhanVien]
    );

    // 7. Xử lý từng loại thuốc (Logic sửa lỗi Duplicate Entry)
    for (const item of chiTiet) {
      const maThuoc = item.MaThuoc;
      const soLuongCanBan = Number(item.SoLuong);
      const donGiaBan = Number(item.GiaBan);

      // A. Insert ChiTietXuat (1 dòng duy nhất cho mỗi mã thuốc)
      // Để tránh lỗi trùng khóa chính khi thuốc lấy từ nhiều lô
      await conn.query(
        "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES (?, ?, ?, ?)",
        [MaPhieuXuat, maThuoc, soLuongCanBan, donGiaBan]
      );

      // B. Tìm lô hàng để trừ kho (FEFO)
      const [loHang] = await conn.query(
        "SELECT MaPhieuNhap, SoLuongConLai, DonGiaNhap FROM ChiTietNhap WHERE MaThuoc = ? AND SoLuongConLai > 0 ORDER BY HanSuDung ASC",
        [maThuoc]
      );

      // Check tồn kho
      const tongTonKhaDung = loHang.reduce((sum, lo) => sum + Number(lo.SoLuongConLai), 0);
      if (tongTonKhaDung < soLuongCanBan) {
        throw new Error(`Thuốc ${maThuoc} không đủ hàng (Còn: ${tongTonKhaDung}, Cần: ${soLuongCanBan})`);
      }

      // C. Trừ kho từng lô (Chỉ UPDATE, không Insert thêm)
      let soLuongCanTru = soLuongCanBan;

      for (const lo of loHang) {
        if (soLuongCanTru === 0) break;

        const slConLaiTrongLo = Number(lo.SoLuongConLai);
        const layTuLoNay = Math.min(slConLaiTrongLo, soLuongCanTru);

        await conn.query(
          "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
          [layTuLoNay, lo.MaPhieuNhap, maThuoc]
        );

        soLuongCanTru -= layTuLoNay;
      }

      // D. Insert vào ChiTietDonThuoc
      await conn.query(
        "INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, SoLuong, DonGiaBan) VALUES (?, ?, ?, ?)",
        [MaDonThuoc, maThuoc, soLuongCanBan, donGiaBan]
      );

      // E. Cập nhật tổng tồn kho
      await conn.query(
        "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
        [soLuongCanBan, maThuoc]
      );
    }

    // 8. Commit Transaction (Lưu tất cả thay đổi)
    await conn.commit();
    
    // --- LƯU Ý QUAN TRỌNG: KHÔNG gọi conn.release() vì ta đang dùng single connection ---

    res.status(201).json({ 
      message: "Xuất đơn thuốc thành công!", 
      MaDonThuoc, 
      MaPhieuXuat,
      TongTien 
    });

  } catch (err) {
    // Rollback nếu có lỗi
    await conn.rollback();
    console.error("Lỗi Transaction:", err);
    res.status(500).json({ message: "Lỗi khi tạo đơn thuốc", error: err.message });
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