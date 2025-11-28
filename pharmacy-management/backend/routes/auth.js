import express from "express";
import db from "../config/db.js"; // Lưu ý: ES Modules bắt buộc phải có đuôi .js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Định nghĩa mã bí mật (Nên đưa vào biến môi trường .env)
const JWT_SECRET = process.env.JWT_SECRET || "baomat_khong_the_bat_mi_123";

// --- API ĐĂNG KÝ ---
router.post("/register", (req, res) => {
  const { TenNhanVien, TaiKhoan, MatKhau, VaiTro } = req.body;

  if (!TenNhanVien || !TaiKhoan || !MatKhau || !VaiTro) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(MatKhau, salt);

  // Logic tạo mã NV tự động: Lấy số lớn nhất + 1
  const sqlGetMaxId = "SELECT MAX(CAST(SUBSTRING(MaNhanVien, 3) AS UNSIGNED)) AS maxId FROM NhanVien WHERE MaNhanVien LIKE 'NV%'";

  db.query(sqlGetMaxId, (err, result) => {
    if (err) {
      console.error("Lỗi lấy Max ID:", err);
      return res.status(500).json({ message: "Lỗi kết nối CSDL" });
    }

    const currentMax = result[0].maxId || 0;
    const nextId = currentMax + 1;
    const MaNhanVien = "NV" + String(nextId).padStart(3, "0");

    const sqlInsert = `
      INSERT INTO NhanVien (MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(sqlInsert, [MaNhanVien, TenNhanVien, TaiKhoan, hashedPassword, VaiTro], (err2) => {
      if (err2) {
        console.error("Lỗi insert:", err2);
        if (err2.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Tài khoản đã tồn tại!" });
        }
        return res.status(500).json({ message: "Lỗi khi tạo tài khoản!" });
      }
      res.status(201).json({ message: "Đăng ký thành công!", MaNhanVien });
    });
  });
});

// --- API ĐĂNG NHẬP ---
router.post("/login", (req, res) => {
  const { TaiKhoan, MatKhau } = req.body; 

  if (!TaiKhoan || !MatKhau) {
    return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu!" });
  }

  const sql = "SELECT * FROM NhanVien WHERE TaiKhoan = ?";
  db.query(sql, [TaiKhoan], async (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi CSDL" });

    if (rows.length === 0) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const user = rows[0];
    
    const match = await bcrypt.compare(MatKhau, user.MatKhau); 
    if (!match) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { 
        MaNhanVien: user.MaNhanVien, 
        TenNhanVien: user.TenNhanVien,
        VaiTro: user.VaiTro 
      }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({
        message: "Đăng nhập thành công",
        token: token,
        user: {
          MaNhanVien: user.MaNhanVien,
          TenNhanVien: user.TenNhanVien,
          VaiTro: user.VaiTro
        }
      });
  });
});

// --- MIDDLEWARE XÁC THỰC ---
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Không tìm thấy token xác thực" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// --- API LẤY THÔNG TIN USER (/me) ---
router.get("/me", verifyToken, (req, res) => {
  res.json({
    user: {
      MaNhanVien: req.user.MaNhanVien,
      TenNhanVien: req.user.TenNhanVien,
      VaiTro: req.user.VaiTro
    }
  });
});

// --- API ĐĂNG XUẤT ---
router.post("/logout", (req, res) => {
  console.log("Người dùng đã đăng xuất");
  return res.status(200).json({ 
    message: "Đăng xuất thành công!", 
    success: true 
  });
});

// [QUAN TRỌNG NHẤT] Dùng export default thay vì module.exports
export default router;