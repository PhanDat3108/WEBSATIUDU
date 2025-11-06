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
router.delete("/delete/:MaThuoc", (req, res) => {
  const { MaThuoc } = req.params;

  if (!MaThuoc) {
    return res.status(400).json({ message: "Thiếu mã thuốc để xoá!" });
  }

  db.query("SELECT * FROM Thuoc WHERE MaThuoc = ?", [MaThuoc], (err, rows) => {
    if (err) {
      console.error(" Lỗi khi kiểm tra thuốc:", err);
      return res.status(500).json({ message: "Lỗi kiểm tra thuốc!" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc để xoá!" });
    }

    db.query("DELETE FROM Thuoc WHERE MaThuoc = ?", [MaThuoc], (err2) => {
      if (err2) {
        console.error("Lỗi khi xoá thuốc:", err2);
        return res.status(500).json({ message: "Lỗi khi xoá thuốc!" });
      }

      res.json({ message: "Xoá thuốc thành công!", MaThuoc });
    });
  });
});

// thongke
router.get("/stats", (req, res) => {
  const TongLoai = "SELECT COUNT(*) AS TongLoai FROM LoaiThuoc"; 
  const TongTon = "SELECT SUM(SoLuongTon) AS TongSoLuongTon FROM Thuoc";
  const SapHetHang = "SELECT COUNT(*) AS SapHetHang FROM Thuoc WHERE SoLuongTon <= 10";
  const SapHetHan = "SELECT COUNT(*) AS SapHetHan FROM Thuoc WHERE HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
  const HetHan = "SELECT COUNT(*) AS HetHan FROM Thuoc WHERE HanSuDung < CURDATE()";

  const data = {};


  db.query(TongLoai, (err, rows1) => {
    if (err) return res.status(500).json({ message: "Lỗi khi lấy tổng số loại thuốc!" });
    data.TongLoai = rows1[0]?.TongLoai || 0;

    db.query(TongTon, (err2, rows2) => {
      if (err2) return res.status(500).json({ message: "Lỗi khi lấy tổng số lượng tồn!" });
      data.TongSoLuongTon = rows2[0]?.TongSoLuongTon || 0;

      db.query(SapHetHang, (err3, rows3) => {
        if (err3) return res.status(500).json({ message: "Lỗi khi lấy thuốc sắp hết hàng!" });
        data.SapHetHang = rows3[0]?.SapHetHang || 0;

        db.query(SapHetHan, (err4, rows4) => {
          if (err4) return res.status(500).json({ message: "Lỗi khi lấy thuốc sắp hết hạn!" });
          data.SapHetHan = rows4[0]?.SapHetHan || 0;

          db.query(HetHan, (err5, rows5) => {
            if (err5) return res.status(500).json({ message: "Lỗi khi lấy thuốc đã hết hạn!" });
            data.HetHan = rows5[0]?.HetHan || 0;

            res.status(200).json(data);
          });
        });
      });
    });
  });
});

export default router;
