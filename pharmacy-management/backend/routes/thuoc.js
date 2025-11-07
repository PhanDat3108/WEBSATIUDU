import express from "express";
import db from "../config/db.js";

const router = express.Router();
//Router thêm thuốc
// POST /api/v1/medicines/add
router.post("/add", (req, res) => {
  const { TenThuoc, DonViTinh, MaLoai, MaNhaCungCap } = req.body;

  if (!TenThuoc || !DonViTinh || !MaLoai || !MaNhaCungCap) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  // Lấy mã lớn nhất hiện tại trong bảng để tạo mã mới
  db.query("SELECT MAX(MaThuoc) AS maxId FROM Thuoc", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB khi tạo mã thuốc" });

    let maxId = result[0].maxId; 
    let nextNumber = 1;

    if (maxId) {
      nextNumber = parseInt(maxId.slice(1)) + 1; 
    }

    const MaThuoc = "T" + String(nextNumber).padStart(3, "0"); 

    const sql = `
      INSERT INTO Thuoc (
        MaThuoc, TenThuoc, DonViTinh, MaLoai, MaNhaCungCap,
        SoLuongTon, GiaNhap, GiaBan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        MaThuoc,
        TenThuoc,
        DonViTinh,
        MaLoai,
        MaNhaCungCap,
        0, 
        0, 
        0  
      ],
      (err2) => {
        if (err2) {
          console.error("Lỗi thêm thuốc:", err2);
          return res.status(500).json({ message: "Lỗi khi thêm thuốc!" });
        }
        res.status(201).json({ message: "Thêm thuốc thành công!", MaThuoc });
      }
    );
  });
});

//sửa thuốc
router.put("/fix/:MaThuoc", (req, res) => {
  const { MaThuoc } = req.params;
  const { TenThuoc, DonViTinh, MaLoai, MaNhaCungCap } = req.body;

  if (!MaThuoc) return res.status(400).json({ message: "Thiếu mã thuốc để sửa!" });

  const sql = `
    UPDATE Thuoc
    SET TenThuoc = ?, DonViTinh = ?, MaLoai = ?, MaNhaCungCap = ?
    WHERE MaThuoc = ?
  `;

  db.query(sql, [TenThuoc, DonViTinh, MaLoai, MaNhaCungCap, MaThuoc], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi khi sửa thuốc!" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy thuốc cần sửa!" });
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
