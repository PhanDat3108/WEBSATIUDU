import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // <-- [SỬA 1] Đảm bảo đã import jwt

const router = express.Router();

//  API đăng ký (Giữ nguyên)
router.post("/register", (req, res) => {
  const { TenNhanVien, TaiKhoan, MatKhau, VaiTro } = req.body;

  if (!TenNhanVien || !TaiKhoan || !MatKhau || !VaiTro) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(MatKhau, salt);

  db.query("SELECT COUNT(*) AS total FROM NhanVien", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    const MaNhanVien = "NV" + String(result[0].total + 1).padStart(3, "0");

    const sql = `
      INSERT INTO NhanVien (MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [MaNhanVien, TenNhanVien, TaiKhoan, hashedPassword, VaiTro], (err2) => {
      if (err2) {
        console.error("Lỗi đăng ký:", err2);
        return res.status(500).json({ message: "Lỗi khi đăng ký tài khoản!" });
      }
      res.status(201).json({ message: "Đăng ký thành công!", MaNhanVien });
    });
  });
});


// api đăng nhập
router.post("/login", (req, res) => {
  // [SỬA 2] Đảm bảo dùng PascalCase (T hoa, M hoa)
  const { TaiKhoan, MatKhau } = req.body; 

  if (!TaiKhoan || !MatKhau) {
    return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu!" });
  }

  db.query("SELECT * FROM NhanVien WHERE TaiKhoan = ?", [TaiKhoan], async (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    // [SỬA 3] Sửa lỗi cú pháp 'lenght' -> 'length'
    if (rows.length === 0) {
      return res.status(400).json({ message: "Không tồn tại tài khoản" })
    }

    const user = rows[0];
    
    const match = await bcrypt.compare(MatKhau, user.MatKhau); 
    
    if (!match) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // [SỬA 4] Tạo JWT Token
    // (Hãy tạo file .env trong thư mục /backend/ và thêm dòng: JWT_SECRET=your_secret_key)
    const token = jwt.sign(
      { 
        MaNhanVien: user.MaNhanVien, 
        VaiTro: user.VaiTro 
      }, 
      process.env.JWT_SECRET || "fallback_secret_key_123", // Phải dùng biến môi trường!
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    // [SỬA 5] Trả về cấu trúc lồng nhau (nested) mà frontend mong đợi
    res.json({
        token: token,
        user: {
          MaNhanVien: user.MaNhanVien,
          TenNhanVien: user.TenNhanVien,
          VaiTro: user.VaiTro
        }
      });
  });
});

export default router;