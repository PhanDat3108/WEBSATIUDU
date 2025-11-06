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
// hiển thị thuốc
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      MaThuoc, TenThuoc, DonViTinh, SoLuongTon, GiaNhap, 
      HanSuDung, NhaCungCap, NgayNhap, MaLoai, GiaBan
    FROM Thuoc
    ORDER BY MaThuoc ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(" Lỗi khi lấy danh sách thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc!" });
    }
    res.json(rows);
  });
});

// xoá thuốc
router.delete("/delete/:maThuoc", (req, res) => {
  const { maThuoc } = req.params;

  if (!maThuoc) {
    return res.status(400).json({ message: "Thiếu mã thuốc để xoá!" });
  }

  db.query("SELECT * FROM Thuoc WHERE MaThuoc = ?", [maThuoc], (err, rows) => {
    if (err) {
      console.error(" Lỗi khi kiểm tra thuốc:", err);
      return res.status(500).json({ message: "Lỗi kiểm tra thuốc!" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc để xoá!" });
    }

    db.query("DELETE FROM Thuoc WHERE MaThuoc = ?", [maThuoc], (err2) => {
      if (err2) {
        console.error("Lỗi khi xoá thuốc:", err2);
        return res.status(500).json({ message: "Lỗi khi xoá thuốc!" });
      }

      res.json({ message: "Xoá thuốc thành công!", maThuoc });
    });
  });
});

// thongke
router.get("/stats", (req, res) => {
  const sqlTongLoai = "SELECT COUNT(*) AS tongLoai FROM LoaiThuoc"; 
  const sqlTongTon = "SELECT SUM(SoLuongTon) AS tongSoLuongTon FROM Thuoc";
  const sqlSapHetHang = "SELECT COUNT(*) AS sapHetHang FROM Thuoc WHERE SoLuongTon <= 10";
  const sqlSapHetHan = "SELECT COUNT(*) AS sapHetHan FROM Thuoc WHERE HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
  const sqlHetHan = "SELECT COUNT(*) AS hetHan FROM Thuoc WHERE HanSuDung < CURDATE()";

  const data = {};


  db.query(sqlTongLoai, (err, rows1) => {
    if (err) return res.status(500).json({ message: "Lỗi khi lấy tổng số loại thuốc!" });
    data.tongLoai = rows1[0]?.tongLoai || 0;

    db.query(sqlTongTon, (err2, rows2) => {
      if (err2) return res.status(500).json({ message: "Lỗi khi lấy tổng số lượng tồn!" });
      data.tongSoLuongTon = rows2[0]?.tongSoLuongTon || 0;

      db.query(sqlSapHetHang, (err3, rows3) => {
        if (err3) return res.status(500).json({ message: "Lỗi khi lấy thuốc sắp hết hàng!" });
        data.sapHetHang = rows3[0]?.sapHetHang || 0;

        db.query(sqlSapHetHan, (err4, rows4) => {
          if (err4) return res.status(500).json({ message: "Lỗi khi lấy thuốc sắp hết hạn!" });
          data.sapHetHan = rows4[0]?.sapHetHan || 0;

          db.query(sqlHetHan, (err5, rows5) => {
            if (err5) return res.status(500).json({ message: "Lỗi khi lấy thuốc đã hết hạn!" });
            data.hetHan = rows5[0]?.hetHan || 0;

            res.status(200).json(data);
          });
        });
      });
    });
  });
});

export default router;
