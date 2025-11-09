import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

//  API đăng ký
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
  const { taiKhoan, matKhau } = req.body;
  if (!taiKhoan || !matKhau) {
    return res.status(400).json({ message: "Thiếu thông tin!" });
  }
  db.query("SELECT * FROM NhanVien WHERE TaiKhoan = ?", [taiKhoan], async (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });
    if (rows.lenght === 0) {
      return res.status(400).json({ message: "Không tồn tại tài khoản" })

    }
    const user = rows[0];
    const match = await bcrypt.compare(matKhau, user.MatKhau);
    if (!match) {
      return res.status(400).json({ message: "Sai mật khẩu" });
      

    }
    res.json({
        message: "Đăng nhập thành công!",
        maNhanVien: user.MaNhanVien,
        tenNhanVien: user.TenNhanVien,
        vaiTro: user.VaiTro
      });
  }

  )
}

)



export default router;
