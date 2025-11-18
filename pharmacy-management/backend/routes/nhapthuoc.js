import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Lấy danh sách chi tiết phiếu nhập
router.get("/details", (req, res) => {
  const sql = `
    SELECT 
      ctn.MaPhieuNhap,
      pn.NgayNhap,
      t.TenThuoc,
      ncc.TenNhaCungCap,
      ctn.SoLuongNhap,
      ctn.DonGiaNhap,
      ctn.HanSuDung,
      ctn.SoLuongConLai -- Hiển thị thêm số lượng còn lại trong lô
    FROM ChiTietNhap ctn
    JOIN Thuoc t ON ctn.MaThuoc = t.MaThuoc
    JOIN PhieuNhap pn ON ctn.MaPhieuNhap = pn.MaPhieuNhap
    JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap
    ORDER BY pn.NgayNhap DESC, ctn.MaPhieuNhap DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy lịch sử chi tiết nhập:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    res.json(rows);
  });
});

// API Thêm phiếu nhập mới (Đã cập nhật cho FEFO)
router.post("/add", (req, res) => {
  const { MaNhaCungCap, MaNhanVien, chiTiet } = req.body;

  // Validation cơ bản
  if (!MaNhaCungCap || !MaNhanVien || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc (Nhà cung cấp, Nhân viên, hoặc chi tiết thuốc)." });
  }

  for (const item of chiTiet) {
    if (!item.MaThuoc || !item.SoLuongNhap || !item.DonGiaNhap || !item.HanSuDung) {
      return res.status(400).json({ message: `Thông tin không hợp lệ cho thuốc ${item.MaThuoc}` });
    }
    if (Number(item.SoLuongNhap) <= 0 || Number(item.DonGiaNhap) < 0) {
       return res.status(400).json({ message: "Số lượng phải > 0 và Đơn giá không được âm." });
    }
  }

  // Bắt đầu Transaction
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: "Lỗi khi bắt đầu transaction", error: err });

    const rollback = (errorMsg, originalError) => {
      db.rollback(() => {
        console.error(errorMsg, originalError);
        res.status(500).json({ message: errorMsg });
      });
    };

    // [THAY ĐỔI 1] Tạo Mã Phiếu Nhập An Toàn (Dùng SQL thay vì JS thuần)
    const maxIdQuery = "SELECT MAX(CAST(SUBSTRING(MaPhieuNhap, 3) AS UNSIGNED)) AS maxNumber FROM PhieuNhap WHERE MaPhieuNhap LIKE 'PN%'";

    db.query(maxIdQuery, (err1, result) => {
      if (err1) return rollback("Lỗi DB khi tạo mã phiếu nhập", err1);

      let maxNumber = (result && result.length > 0) ? result[0].maxNumber : 0;
      if (maxNumber === null) maxNumber = 0;
      let nextNumber = maxNumber + 1;

      const MaPhieuNhap = "PN" + String(nextNumber).padStart(3, "0");
      const NgayNhap = new Date(); 

      const TongTien = chiTiet.reduce((sum, item) => {
        return sum + (Number(item.SoLuongNhap) * Number(item.DonGiaNhap));
      }, 0);

      // Thêm vào bảng PhieuNhap
      const sqlPhieuNhap = `
        INSERT INTO PhieuNhap (MaPhieuNhap, NgayNhap, TongTien, MaNhaCungCap, MaNhanVien)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sqlPhieuNhap, [MaPhieuNhap, NgayNhap, TongTien, MaNhaCungCap, MaNhanVien], (err2) => {
        if (err2) return rollback("Lỗi khi thêm phiếu nhập", err2);

        // [THAY ĐỔI 2] Thêm cột SoLuongConLai vào câu lệnh INSERT
        const sqlChiTiet = `
          INSERT INTO ChiTietNhap (MaPhieuNhap, MaThuoc, SoLuongNhap, DonGiaNhap, HanSuDung, SoLuongConLai)
          VALUES ?
        `;
        
        // Map dữ liệu: SoLuongConLai ban đầu chính bằng SoLuongNhap
        const chiTietValues = chiTiet.map(item => [
          MaPhieuNhap,
          item.MaThuoc,
          item.SoLuongNhap,
          item.DonGiaNhap,
          item.HanSuDung,
          item.SoLuongNhap // <--- QUAN TRỌNG: Khởi tạo tồn kho lô này
        ]);
        
        db.query(sqlChiTiet, [chiTietValues], (err3) => {
          if (err3) return rollback("Lỗi khi thêm chi tiết phiếu nhập", err3);

          // Cập nhật bảng Thuoc (Tổng tồn kho và Giá nhập mới nhất)
          let updatePromises = chiTiet.map(item => {
            return new Promise((resolve, reject) => {
              const sqlUpdateThuoc = `
                UPDATE Thuoc 
                SET 
                  SoLuongTon = SoLuongTon + ?,
                  GiaNhap = ?
                WHERE MaThuoc = ?
              `;
              db.query(sqlUpdateThuoc, [item.SoLuongNhap, item.DonGiaNhap, item.MaThuoc], (errUpdate) => {
                if (errUpdate) return reject(errUpdate);
                resolve(true);
              });
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              db.commit(errCommit => {
                if (errCommit) return rollback("Lỗi khi commit transaction", errCommit);
                
                res.status(201).json({ 
                  message: "Thêm phiếu nhập thành công!",
                  MaPhieuNhap: MaPhieuNhap,
                  TongTien: TongTien
                });
              });
            })
            .catch(errUpdate => {
               return rollback("Lỗi khi cập nhật kho thuốc tổng", errUpdate);
            });
        });
      });
    });
  });
});

export default router;