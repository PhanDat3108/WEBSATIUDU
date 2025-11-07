import express from "express";
import db from "../config/db.js";

const router = express.Router();
//Router thêm thuốc
router.post("/add", (req, res) => {
  const {
    TenThuoc,
    DonViTinh,
    SoLuongTon,
    GiaNhap,
    HanSuDung,
    NhaCungCap,
    NgayNhap,
    MaLoai,
    GiaBan
  } = req.body;

  if (!TenThuoc || !DonViTinh || !HanSuDung || !MaLoai || !GiaBan) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  db.query("SELECT COUNT(*) AS total FROM Thuoc", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB" });

    const MaThuoc = "T" + String(result[0].total + 1).padStart(3, "0");

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
        MaThuoc,
        TenThuoc,
        DonViTinh,
        SoLuongTon || 0,
        GiaNhap || 0,
        HanSuDung,
        NhaCungCap || null,
        NgayNhap || new Date(),
        MaLoai,
        GiaBan
      ],
      (err2) => {
        if (err2) {
          console.error(" Lỗi thêm thuốc:", err2);
          return res.status(500).json({ message: "Lỗi khi thêm thuốc!" });
        }
        res.status(201).json({ message: "Thêm thuốc thành công!", MaThuoc });
      }
    );
  });

});
//sửa thuốc
router.put("/fix", (req, res) => {
  const {
    MaThuoc,
    TenThuoc,
    DonViTinh,
    SoLuongTon,
    GiaNhap,
    HanSuDung,
    NhaCungCap,
    NgayNhap,
    MaLoai,
    GiaBan
  } = req.body;

  if (!MaThuoc) {
    return res.status(400).json({ message: "Thiếu mã thuốc để sửa!" });
  }

  const sql = `
    UPDATE Thuoc
    SET TenThuoc = ?, DonViTinh = ?, SoLuongTon = ?, GiaNhap = ?,
        HanSuDung = ?, NhaCungCap = ?, NgayNhap = ?, MaLoai = ?, GiaBan = ?
    WHERE MaThuoc = ?
  `;

  db.query(sql, [
    TenThuoc,
    DonViTinh,
    SoLuongTon || 0,
    GiaNhap || 0,
    HanSuDung,
    NhaCungCap || null,
    NgayNhap || new Date(),
    MaLoai,
    GiaBan,
    MaThuoc
  ], (err, result) => {
    if (err) {
      console.error("Lỗi khi sửa thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi sửa thuốc!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc cần sửa!" });
    }
    res.status(200).json({ message: "Sửa thuốc thành công!", MaThuoc });
  });
});
// hiển thị thuốc
router.get("/list", (req, res) => {
  const sql = `
  SELECT 
    t.MaThuoc, t.TenThuoc, t.DonViTinh, t.SoLuongTon, 
    t.GiaNhap, t.GiaBan, 
    n.TenNhaCungCap AS TenNhaCungCap,
    l.TenLoai AS TenLoai
  FROM Thuoc t
  JOIN NhaCungCap n ON t.MaNhaCungCap = n.MaNhaCungCap
  JOIN LoaiThuoc l ON t.MaLoai = l.MaLoai
  ORDER BY t.MaThuoc ASC
`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc!" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không có thuốc nào trong kho!" });
    }
    res.json(rows);
  });
});



export default router;
