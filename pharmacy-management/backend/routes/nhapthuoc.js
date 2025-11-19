import express from "express";
import db from "../config/db.js";

const router = express.Router();

//lấy danh sách chi tiết phiếu nhập
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
      ctn.SoLuongConLai  -- [ĐÃ THÊM] Lấy cột này để hiển thị tồn lô
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
router.post("/add", (req, res) => {
  const { MaNhaCungCap, MaNhanVien, chiTiet } = req.body;

  // 1. Validate dữ liệu đầu vào
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

  // 2. Bắt đầu Transaction
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: "Lỗi khi bắt đầu transaction", error: err });

    const rollback = (errorMsg, originalError) => {
      db.rollback(() => {
        console.error(errorMsg, originalError);
        res.status(500).json({ message: errorMsg });
      });
    };

    // 3. Tạo Mã Phiếu Nhập tự động (PNxxx)
    db.query("SELECT MAX(MaPhieuNhap) AS maxId FROM PhieuNhap", (err1, maxIdResult) => {
      if (err1) return rollback("Lỗi DB khi lấy maxId phiếu nhập", err1);

      let nextNumber = 1;
      const maxId = maxIdResult[0].maxId; 
      if (maxId) {
          try {
              nextNumber = parseInt(maxId.slice(2)) + 1; 
          } catch (e) {
              return rollback("Lỗi khi phân tích MaPhieuNhap", e);
          }
      }
      const MaPhieuNhap = "PN" + String(nextNumber).padStart(3, "0");
      const NgayNhap = new Date(); 

      // Tính tổng tiền
      const TongTien = chiTiet.reduce((sum, item) => {
        return sum + (Number(item.SoLuongNhap) * Number(item.DonGiaNhap));
      }, 0);

      // 4. INSERT bảng PHIEUNHAP (Bước này bị thiếu trong code bạn gửi)
      const sqlPhieuNhap = `
        INSERT INTO PhieuNhap (MaPhieuNhap, NgayNhap, TongTien, MaNhaCungCap, MaNhanVien)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.query(sqlPhieuNhap, [MaPhieuNhap, NgayNhap, TongTien, MaNhaCungCap, MaNhanVien], (err2) => {
        if (err2) return rollback("Lỗi khi thêm phiếu nhập", err2);

        // 5. INSERT bảng CHITIETNHAP
        // Quan trọng: Thêm cột SoLuongConLai và gán giá trị bằng SoLuongNhap
        const sqlChiTiet = `
          INSERT INTO ChiTietNhap (MaPhieuNhap, MaThuoc, SoLuongNhap, DonGiaNhap, HanSuDung, SoLuongConLai)
          VALUES ?
        `;
        
        const chiTietValues = chiTiet.map(item => [
          MaPhieuNhap,
          item.MaThuoc,
          item.SoLuongNhap,
          item.DonGiaNhap,
          item.HanSuDung,
          item.SoLuongNhap // <--- [QUAN TRỌNG] Khởi tạo Tồn lô ban đầu = Số lượng nhập
        ]);
        
        db.query(sqlChiTiet, [chiTietValues], (err3) => {
          if (err3) return rollback("Lỗi khi thêm chi tiết phiếu nhập", err3);

          // 6. Cập nhật Tồn kho tổng và Giá nhập mới nhất trong bảng THUOC
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

          // 7. Commit Transaction sau khi hoàn tất mọi thứ
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
               return rollback("Lỗi khi cập nhật kho thuốc", errUpdate);
            });
        });
      });
    });
  });
});
export default router;
