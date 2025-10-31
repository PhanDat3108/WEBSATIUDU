import express from "express";
import db from "../config/db.js";

const router = express.Router();
//Router thêm thuốc
router.post("/add", (req, res) => {
  const {
    tenThuoc,
    donViTinh,
    soLuongTon,
    giaNhap,
    hanSuDung,
    nhaCungCap,
    ngayNhap,
    maLoai,
    giaBan
  } = req.body;

  if (!tenThuoc || !donViTinh || !hanSuDung || !maLoai || !giaBan) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  db.query("SELECT COUNT(*) AS total FROM Thuoc", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    const maThuoc = "T" + String(result[0].total + 1).padStart(3, "0");

    const sql = `
      INSERT INTO Thuoc (
        MaThuoc, TenThuoc, DonViTinh, SoLuongTon,
        GiaNhap, HanSuDung, NhaCungCap, NgayNhap, MaLoai, GiaBan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        maThuoc,
        tenThuoc,
        donViTinh,
        soLuongTon || 0,
        giaNhap || 0,
        hanSuDung,
        nhaCungCap || null,
        ngayNhap || new Date(),
        maLoai,
        giaBan
      ],
      (err2) => {
        if (err2) {
          console.error(" Lỗi thêm thuốc:", err2);
          return res.status(500).json({ message: "Lỗi khi thêm thuốc!" });
        }
        res.status(201).json({ message: "Thêm thuốc thành công!", maThuoc });
      }
    );
  });

});
//sửa thuốc
router.put("/fix", (req, res) => {
  const {
    maThuoc,
    tenThuoc,
    donViTinh,
    soLuongTon,
    giaNhap,
    hanSuDung,
    nhaCungCap,
    ngayNhap,
    maLoai,
    giaBan
  } = req.body;

  if (!maThuoc) {
    return res.status(400).json({ message: "Thiếu mã thuốc để sửa!" });
  }

  const sql = `
    UPDATE Thuoc
    SET TenThuoc = ?, DonViTinh = ?, SoLuongTon = ?, GiaNhap = ?,
        HanSuDung = ?, NhaCungCap = ?, NgayNhap = ?, MaLoai = ?, GiaBan = ?
    WHERE MaThuoc = ?
  `;

  db.query(sql, [
    tenThuoc,
    donViTinh,
    soLuongTon || 0,
    giaNhap || 0,
    hanSuDung,
    nhaCungCap || null,
    ngayNhap || new Date(),
    maLoai,
    giaBan,
    maThuoc
  ], (err, result) => {
    if (err) {
      console.error("Lỗi khi sửa thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi sửa thuốc!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc cần sửa!" });
    }
    res.status(200).json({ message: "Sửa thuốc thành công!", maThuoc });
  });
});


export default router;
