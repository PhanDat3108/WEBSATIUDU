import express from "express";
import db from "../config/db.js";

const router = express.Router();

//lấy danh sahc
router.get("/list", (req, res) => {
  const sql = "SELECT * FROM NhanVien";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách nhân viên:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên!" });
    }
    res.status(200).json(result);
  });
});

//them
router.post("/add", (req, res) => {
  const { TenNhanVien, TaiKhoan, MatKhau, VaiTro } = req.body;

  if (!TenNhanVien || !TaiKhoan || !MatKhau || !VaiTro) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  db.query("SELECT COUNT(*) AS total FROM NhanVien", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    const MaNhanVien = "NV" + String(result[0].total + 1).padStart(3, "0");

    const sql = `
      INSERT INTO NhanVien (MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro], (err2) => {
      if (err2) {
        console.error("Lỗi khi thêm nhân viên:", err2);
        return res.status(500).json({ message: "Lỗi khi thêm nhân viên!" });
      }
      res.status(201).json({ message: "Thêm nhân viên thành công!", MaNhanVien });
    });
  });
});

//sua
router.put("/fix", (req, res) => {
  const { MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro } = req.body;

  if (!MaNhanVien || !TenNhanVien) {
    return res.status(400).json({ message: "Thiếu mã hoặc tên nhân viên!" });
  }

  const sql = `
    UPDATE NhanVien
    SET TenNhanVien = ?, TaiKhoan = ?, MatKhau = ?, VaiTro = ?
    WHERE MaNhanVien = ?
  `;

  db.query(sql, [TenNhanVien, TaiKhoan, MatKhau, VaiTro, MaNhanVien], (err, result) => {
    if (err) {
      console.error("Lỗi khi sửa nhân viên:", err);
      return res.status(500).json({ message: "Lỗi khi sửa thông tin nhân viên!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên cần sửa!" });
    }

    res.status(200).json({ message: "Sửa thông tin nhân viên thành công!", MaNhanVien });
  });
});

//xoá
router.delete("/delete/:MaNhanVien", (req, res) => {
  const { MaNhanVien } = req.params;
  if (!MaNhanVien) {
    return res.status(400).json({ message: "Thiếu mã nhân viên để xoá!" });
  }

  db.query("SELECT * FROM NhanVien WHERE MaNhanVien = ?", [MaNhanVien], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi kiểm tra nhân viên!" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
    }

    db.query("DELETE FROM NhanVien WHERE MaNhanVien = ?", [MaNhanVien], (err2) => {
      if (err2) {
        console.error("Lỗi khi xoá nhân viên:", err2);
        return res.status(500).json({ message: "Lỗi khi xoá nhân viên!" });
      }

      res.json({ message: "Xoá nhân viên thành công!" });
    });
  });
});

export default router;
