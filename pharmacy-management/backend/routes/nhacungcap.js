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
    SELECT MaNhaCungCap, TenNhaCungCap, DiaChi, SoDienThoai, Email 
    FROM NhaCungCap 
    ORDER BY MaNhaCungCap ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách NCC:", err);
      return res.status(500).json({ message: "Lỗi khi lấy Nhà cung cấp" });
    }
    res.json(rows);
  });
});


router.post("/add", (req, res) => {
  const { TenNhaCungCap, DiaChi, SoDienThoai, Email } = req.body; 

  if (!TenNhaCungCap) {
    return res.status(400).json({ message: "Tên nhà cung cấp là bắt buộc!" });
  }


  db.query("SELECT MAX(MaNhaCungCap) AS maxId FROM NhaCungCap", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi DB khi tạo mã NCC" });

    let maxId = result[0].maxId; 
    let nextNumber = 1;
    if (maxId) {
      try {
        nextNumber = parseInt(maxId.slice(3)) + 1; 
      } catch(e) {
         return res.status(500).json({ message: "Lỗi khi phân tích mã NCC" });
      }
    }
    const MaNhaCungCap = "NCC" + String(nextNumber).padStart(3, "0"); 

    const sql = `
      INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, DiaChi, SoDienThoai, Email) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [MaNhaCungCap, TenNhaCungCap, DiaChi || null, SoDienThoai || null, Email || null], (err2) => {
      if (err2) {
        console.error("Lỗi khi thêm NCC:", err2);
        return res.status(500).json({ message: "Lỗi khi thêm nhà cung cấp!" });
      }
      res.status(201).json({ message: "Thêm nhà cung cấp thành công!", MaNhaCungCap });
    });
  });
});

router.put("/fix", (req, res) => {

  const { MaNhaCungCap, TenNhaCungCap, DiaChi, SoDienThoai, Email } = req.body;

  if (!TenNhaCungCap) {
    return res.status(400).json({ message: "Tên nhà cung cấp là bắt buộc!" });
  }
  if (!MaNhaCungCap) {
    return res.status(400).json({ message: "Thiếu Mã Nhà Cung Cấp!" });
  }

  const sql = `
    UPDATE NhaCungCap 
    SET TenNhaCungCap = ?, DiaChi = ?, SoDienThoai = ?, Email = ?
    WHERE MaNhaCungCap = ?
  `;
  
  db.query(sql, [TenNhaCungCap, DiaChi || null, SoDienThoai || null, Email || null, MaNhaCungCap], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật NCC:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật nhà cung cấp!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà cung cấp để cập nhật." });
    }
    res.status(200).json({ message: "Cập nhật nhà cung cấp thành công!", MaNhaCungCap: MaNhaCungCap });
  });
});

router.delete("/delete/:maNhaCungCap", (req, res) => {
  const { maNhaCungCap } = req.params;
  if (!maNhaCungCap) {
    return res.status(400).json({ message: "Thiếu Mã Nhà Cung Cấp!" });
  }

  const sql = "DELETE FROM NhaCungCap WHERE MaNhaCungCap = ?";
  db.query(sql, [maNhaCungCap], (err, result) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ message: "Không thể xóa nhà cung cấp này vì đang có thuốc sử dụng." });
      }
      console.error("Lỗi khi xóa NCC:", err);
      return res.status(500).json({ message: "Lỗi khi xóa nhà cung cấp!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà cung cấp để xóa." });
    }
    res.status(200).json({ message: "Xóa nhà cung cấp thành công." });
  });
});

export default router;