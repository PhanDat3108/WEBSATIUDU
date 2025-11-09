import express from "express";
import db from "../config/db.js";

const router = express.Router();
// lấy cái tên nhà cung cấp để chọn khi sửa 
router.get("/", (req, res) => {
  const sql = `SELECT MaNhaCungCap, TenNhaCungCap FROM NhaCungCap ORDER BY TenNhaCungCap ASC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi khi lấy Nhà cung cấp" });
    res.json(rows);
  });
});

router.get("/list", (req, res) => {
  const sql = `
    SELECT 
     MaNhaCungCap,TenNhaCungCap,DiaChi,SoDienThoai,Email
    FROM NhaCungCap
    ORDER BY MaNhaCungCap ASC
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