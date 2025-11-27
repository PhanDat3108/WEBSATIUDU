import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API: LẤY TOÀN BỘ CHI TIẾT LỊCH SỬ XUẤT (BÁN + BỎ + KHÁC)
// Dùng để hiển thị bảng trong XuatNoiBoManagement
router.get("/details-all", (req, res) => {
  const sql = `
    SELECT 
      px.MaPhieuXuat,
      px.NgayXuat,
      px.LoaiXuat,
      nv.TenNhanVien,
      t.TenThuoc,
      ctx.SoLuongXuat,
      ctx.DonGiaXuat,
      (ctx.SoLuongXuat * ctx.DonGiaXuat) as ThanhTien
    FROM PhieuXuat px
    JOIN ChiTietXuat ctx ON px.MaPhieuXuat = ctx.MaPhieuXuat
    JOIN Thuoc t ON ctx.MaThuoc = t.MaThuoc
    LEFT JOIN NhanVien nv ON px.MaNhanVien = nv.MaNhanVien
    ORDER BY px.NgayXuat DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi lấy lịch sử xuất chi tiết:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy dữ liệu." });
    }
    res.json(results);
  });
});


export default router;