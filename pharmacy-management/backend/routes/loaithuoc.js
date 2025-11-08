import express from "express";
import db from "../config/db.js";

const router = express.Router();
//lấy tên loại thuốc khi chọn để sửa
router.get("/listname", (req, res) => {
  const sql = `SELECT MaLoai, TenLoai FROM LoaiThuoc ORDER BY TenLoai ASC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi khi lấy Loại thuốc" });
    res.json(rows);
  });
});
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
     Maloai,TenLoai
    FROM Loaithuoc
    ORDER BY MaLoai ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách nhà cung cấp" });
    }
    res.json(rows);
  });
});
export default router;