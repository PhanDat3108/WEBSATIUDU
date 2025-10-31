import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

//  API đăng ký
router.post("/register", async (req, res) => {
  const { tenNhanVien, taiKhoan, matKhau, vaiTro } = req.body;

  if (!tenNhanVien || !taiKhoan || !matKhau || !vaiTro) {
    return res.status(400).json({ message: "Thiếu thông tin!" });
  }
  const hash = await bcrypt.hash(matKhau, 10);
  db.query("SELECT COUNT(*) AS total FROM NhanVien", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    const maNhanVien = "NV" + String(result[0].total + 1).padStart(3, "0");

    const sql = `
      INSERT INTO NhanVien (MaNhanVien, TenNhanVien, TaiKhoan, MatKhau, VaiTro)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [maNhanVien, tenNhanVien, taiKhoan, hash, vaiTro], (err2) => {
      if (err2) {
        if (err2.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
        }
        return res.status(500).json({ message: "Lỗi khi thêm nhân viên!" });
      }
      res.status(201).json({ message: "Đăng ký thành công!", maNhanVien });
    });
  });
});
// api đăng nhập
router.post("/login",(req,res)=>{
    const { taiKhoan, matKhau} = req.body;
    if ( !taiKhoan || !matKhau ) {
    return res.status(400).json({ message: "Thiếu thông tin!" });
  }
  db.query("SELECT * FROM NhanVien WHERE TaiKhoan = ?",[taiKhoan],async (err,rows)=>{
    if (err) return res.status(500).json({ message: "Lỗi DB" });
    if (rows.lenght===0){
        return res.status(400).json({message:"Không tồn tại tài khoản"})

    }
    const user=rows[0];
    const match= await bcrybt.compare(matKhau,user.matKhau)

  }

  )
}

)



export default router;
