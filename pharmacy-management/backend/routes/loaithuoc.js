import express from "express";
import db from "../config/db.js";

const router = express.Router();
//lấy tên loại thuốc khi chọn để sửa
router.get("/", (req, res) => {
  const sql = `SELECT MaLoai, TenLoai FROM LoaiThuoc ORDER BY TenLoai ASC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Lỗi khi lấy Loại thuốc" });
    res.json(rows);
  });
});
router.get("/list", (req, res) => {
  
  const sql = `
    SELECT 
      MaLoai, TenLoai
    FROM LoaiThuoc
    ORDER BY MaLoai ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách loại thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách loại thuốc!", error: err.sqlMessage });
    }
    res.json(rows);
  });
});

// API 2: Thêm loại thuốc (Bị thiếu)
// POST /api/v1/loaithuoc/add
router.post("/add", (req, res) => {
  const { TenLoai } = req.body;
  if (!TenLoai) {
    return res.status(400).json({ message: "Thiếu Tên Loại!" });
  }

 const maxIdQuery =
    "SELECT MAX(CAST(SUBSTRING(MaLoai, 3) AS UNSIGNED)) AS maxNumber FROM LoaiThuoc WHERE MaLoai LIKE 'L%'";

  db.query(maxIdQuery, (err, result) => {
    if (err) {
      console.error("Lỗi DB khi tạo mã loại:", err);
      return res.status(500).json({ message: "Lỗi DB khi tạo mã loại" });
    }

    let maxNumber = result && result.length > 0 ? result[0].maxNumber : 0;
    if (maxNumber === null) {
      maxNumber = 0;
    }
    let nextNumber = maxNumber + 1;

    const MaLoai = "LT" + String(nextNumber).padStart(3, "0");

    const sql = "INSERT INTO LoaiThuoc (MaLoai, TenLoai) VALUES (?, ?)";
    db.query(sql, [MaLoai, TenLoai], (err2) => {
      if (err2) {
        console.error("Lỗi khi thêm loại thuốc:", err2);
        return res.status(500).json({ message: "Lỗi khi thêm loại thuốc!" });
      }
      res.status(201).json({ message: "Thêm loại thuốc thành công!", MaLoai });
    });
  });
});

router.put("/fix", (req, res) => {
  const { MaLoai, TenLoai } = req.body; 

  if (!TenLoai) {
    return res.status(400).json({ message: "Thiếu Tên Loại!" });
  }
  if (!MaLoai) {
    return res.status(400).json({ message: "Thiếu Mã Loại!" });
  }

  const sql = "UPDATE LoaiThuoc SET TenLoai = ? WHERE MaLoai = ?";
  db.query(sql, [TenLoai, MaLoai], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật loại thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật loại thuốc!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy loại thuốc để cập nhật." });
    }
    res.status(200).json({ message: "Cập nhật loại thuốc thành công!", MaLoai: MaLoai });
  });
});

router.delete("/delete/:maLoai", (req, res) => {
  const { maLoai } = req.params;
  if (!maLoai) {
    return res.status(400).json({ message: "Thiếu Mã Loại!" });
  }

  const sql = "DELETE FROM LoaiThuoc WHERE MaLoai = ?";
  db.query(sql, [maLoai], (err, result) => {
    if (err) {

      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ message: "Không thể xóa loại thuốc này vì đang có thuốc sử dụng nó." });
      }
      console.error("Lỗi khi xóa loại thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi xóa loại thuốc!" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy loại thuốc để xóa." });
    }
    res.status(200).json({ message: "Xóa loại thuốc thành công." });
  });
});

export default router;