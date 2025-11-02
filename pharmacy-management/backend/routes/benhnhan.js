import express from "express";
import db from "../config/db.js";


const router = express.Router();

//  api sửa thông tin bệnh nhân
router.put("/fix", (req, res) => {
  const {
    maBenhNhan,
    tenBenhNhan,
    ngaySinh,
    gioiTinh,
    soDienThoai,
    diaChi
  } = req.body;

  if (!maBenhNhan || !tenBenhNhan) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc của bệnh nhân!" });
  }

  const sql = `
    UPDATE BenhNhan
    SET TenBenhNhan = ?, NgaySinh = ?, GioiTinh = ?, SoDienThoai = ?, DiaChi = ?
    WHERE MaBenhNhan = ?
  `;

  db.query(sql, [
    tenBenhNhan,
    ngaySinh || null,
    gioiTinh || null,
    soDienThoai || null,
    diaChi || null,
    maBenhNhan
  ], (err, result) => {
    if (err) {
      console.error("Lỗi khi sửa thông tin bệnh nhân:", err);
      return res.status(500).json({ message: "Lỗi khi sửa thông tin bệnh nhân!" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bệnh nhân cần sửa!" });
    }

    res.status(200).json({ message: "Sửa thông tin bệnh nhân thành công!", maBenhNhan });
  });
});

//api xoá thông tin bệnh nhân
router.delete("/delete/:maBenhNhan", (req, res) => {
    const { maBenhNhan } = req.params;
    if (!maBenhNhan) {
        return res.status(400).json({ message: "Thiếu mã bệnh nhân để xoá" });
    }

    db.query("SELECT * FROM BenhNhan WHERE MaBenhNhan = ?", [maBenhNhan], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi khi kiểm tra bệnh nhân" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân" });
        }

        db.query("DELETE FROM BenhNhan WHERE MaBenhNhan = ?", [maBenhNhan], (err2) => {
            if (err2) {
                console.error("Lỗi khi xoá bệnh nhân:", err2);
                return res.status(500).json({ message: "Lỗi khi xoá bệnh nhân!" });
            }

            res.json({ message: "Xoá bệnh nhân thành công" });
        });
    });
});


export default router;
