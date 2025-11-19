import express from "express";
import db from "../config/db.js";


const router = express.Router();
// API Lấy tất cả bệnh nhân (để fix lỗi "Không thể tải danh sách")
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      MaBenhNhan, TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi
    FROM BenhNhan
    ORDER BY MaBenhNhan ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách bệnh nhân" });
    }
    // Trả về dữ liệu JSON (FE đang dùng PascalCase, nên đây là chính xác)
    res.json(rows);
  });
});

//  api sửa thông tin bệnh nhân
router.put("/fix", (req, res) => {
  const {
    MaBenhNhan,
    TenBenhNhan,
    NgaySinh,
    GioiTinh,
    SoDienThoai,
    DiaChi
  } = req.body;

  if (!MaBenhNhan || !TenBenhNhan) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc của bệnh nhân!" });
  }

  const sql = `
    UPDATE BenhNhan
    SET TenBenhNhan = ?, NgaySinh = ?, GioiTinh = ?, SoDienThoai = ?, DiaChi = ?
    WHERE MaBenhNhan = ?
  `;

  db.query(sql, [
    TenBenhNhan,
    NgaySinh || null,
    GioiTinh || null,
    SoDienThoai || null,
    DiaChi || null,
    MaBenhNhan
  ], (err, result) => {
    if (err) {
      console.error("Lỗi khi sửa thông tin bệnh nhân:", err);
      return res.status(500).json({ message: "Lỗi khi sửa thông tin bệnh nhân!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân cần sửa!" });
    }

    res.status(200).json({ message: "Sửa thông tin bệnh nhân thành công!", MaBenhNhan });
  });
});

//api xoá thông tin bệnh nhân
router.delete("/delete/:MaBenhNhan", (req, res) => {
    const { MaBenhNhan } = req.params;
    if (!MaBenhNhan) {
        return res.status(400).json({ message: "Thiếu mã bệnh nhân để xoá" });
    }

    db.query("SELECT * FROM BenhNhan WHERE MaBenhNhan = ?", [MaBenhNhan], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi khi kiểm tra bệnh nhân" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
        }

        db.query("DELETE FROM BenhNhan WHERE MaBenhNhan = ?", [MaBenhNhan], (err2) => {
            if (err2) {
                console.error("Lỗi khi xoá bệnh nhân:", err2);
                return res.status(500).json({ message: "Lỗi khi xoá bệnh nhân!" });
            }

            res.json({ message: "Xoá bệnh nhân thành công" });
        });
    });
});
//api hiển thị benhnhan
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      MaBenhNhan, TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi
    FROM BenhNhan
    ORDER BY MaBenhNhan ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách bệnh nhân" });
    }
    res.json(rows);
  });
});
// thêm bẹnh nhân
router.post("/add", (req, res) => {
  const { TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi } = req.body;

  if (!TenBenhNhan) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc của bệnh nhân!" });
  }

  const maxIdQuery =
    "SELECT MAX(CAST(SUBSTRING(MaBenhNhan, 3) AS UNSIGNED)) AS maxNumber FROM BenhNhan WHERE MaBenhNhan LIKE 'BN%'";

  db.query(maxIdQuery, (err, result) => {
    if (err) {
      console.error("Lỗi DB khi tạo mã bệnh nhân:", err);
      return res.status(500).json({ message: "Lỗi DB khi tạo mã bệnh nhân" });
    }

    let maxNumber = result && result.length > 0 ? result[0].maxNumber : 0;
    if (maxNumber === null) {
      maxNumber = 0;
    }
    let nextNumber = maxNumber + 1;

    const MaBenhNhan = "BN" + String(nextNumber).padStart(3, "0");
    const sql = `
      INSERT INTO BenhNhan (
        MaBenhNhan, TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [MaBenhNhan, TenBenhNhan, NgaySinh || null, GioiTinh || null, SoDienThoai || null, DiaChi || null],
      (err2) => {
        if (err2) {
          console.error("Lỗi thêm bệnh nhân:", err2);
          return res.status(500).json({ message: "Lỗi khi thêm bệnh nhân!" });
        }
        res.status(201).json({ message: "Thêm bệnh nhân thành công!", MaBenhNhan });
      }
    );
  });
});

router.post("/add", (req, res) => {
  const { TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi } = req.body;

  if (!TenBenhNhan || !SoDienThoai) {
    return res.status(400).json({ message: "Tên và SĐT là bắt buộc" });
  }

  // Kiểm tra trùng SĐT
  db.query("SELECT MaBenhNhan FROM BenhNhan WHERE SoDienThoai = ?", [SoDienThoai], (err, exists) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (exists.length > 0) {
        return res.status(409).json({ message: "Số điện thoại này đã tồn tại trong hệ thống!" });
    }

    // Tạo mã tự động BNxxx
    db.query("SELECT MAX(CAST(SUBSTRING(MaBenhNhan, 3) AS UNSIGNED)) as maxId FROM BenhNhan", (err2, result) => {
        if (err2) return res.status(500).json({ message: "Lỗi tạo mã" });
        
        const nextId = (result[0].maxId || 0) + 1;
        const MaBenhNhan = "BN" + String(nextId).padStart(3, "0");

        const sqlInsert = `INSERT INTO BenhNhan (MaBenhNhan, TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi) VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.query(sqlInsert, [MaBenhNhan, TenBenhNhan, NgaySinh, GioiTinh, SoDienThoai, DiaChi], (err3) => {
            if (err3) return res.status(500).json({ message: "Lỗi thêm bệnh nhân" });
            res.status(201).json({ message: "Thêm bệnh nhân thành công", MaBenhNhan });
        });
    });
  });
});
export default router;
