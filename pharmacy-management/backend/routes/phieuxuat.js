import express from "express";
import db from "../config/db.js";

const router = express.Router();

// -----------------------------------------------------------------
// API 1: LẤY LỊCH SỬ ĐƠN THUỐC (History Page)
// GET /api/v1/phieuxuat/list-donthuoc
// -----------------------------------------------------------------
router.get("/list-donthuoc", (req, res) => {
  const sql = `
    SELECT 
      dt.MaDonThuoc,
      dt.NgayLap,
      bn.TenBenhNhan,
      nv.TenNhanVien AS TenNguoiLap,
      dt.TongTien,
      dt.MaPhieuXuat
    FROM DonThuoc dt
    JOIN BenhNhan bn ON dt.MaBenhNhan = bn.MaBenhNhan
    JOIN NhanVien nv ON dt.MaNhanVien = nv.MaNhanVien
    ORDER BY dt.NgayLap DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy lịch sử đơn thuốc:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    res.json(rows);
  });
});

// -----------------------------------------------------------------
// API 2: THÊM MỘT GIAO DỊCH BÁN THUỐC MỚI (Transaction)
// POST /api/v1/phieuxuat/add
// -----------------------------------------------------------------
router.post("/add", (req, res) => {
  /*
    Dữ liệu frontend (req.body) gửi lên dự kiến có dạng:
    {
      "MaBenhNhan": "BN001",
      "MaNhanVien": "NV001", // Lấy từ user đang đăng nhập
      "LoaiXuat": "Bán", // (Hoặc "Bỏ", "Khác" theo database của bạn)
      "chiTiet": [
        { "MaThuoc": "T001", "SoLuong": 10, "DonGiaBan": 55000 },
        { "MaThuoc": "T002", "SoLuong": 5, "DonGiaBan": 125000 }
      ]
    }
  */
  const { MaBenhNhan, MaNhanVien, LoaiXuat, chiTiet } = req.body;

  // --- 1. Validate Input ---
  if (!MaBenhNhan || !MaNhanVien || !LoaiXuat || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc (BN, NV, Loại xuất, hoặc chi tiết thuốc)." });
  }

  for (const item of chiTiet) {
    if (!item.MaThuoc || !item.SoLuong || !item.DonGiaBan) {
      return res.status(400).json({ message: `Thông tin không hợp lệ cho thuốc ${item.MaThuoc}` });
    }
    if (Number(item.SoLuong) <= 0 || Number(item.DonGiaBan) < 0) {
       return res.status(400).json({ message: "Số lượng phải > 0 và Đơn giá không được âm." });
    }
  }

  // --- 2. Bắt đầu Transaction ---
  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi bắt đầu transaction", error: err });

    // Hàm rollback (để gọi khi có lỗi)
    const rollback = (errorMsg, originalError) => {
      db.rollback(() => {
        console.error(errorMsg, originalError);
        res.status(500).json({ message: errorMsg, error: originalError ? originalError.message : "Lỗi không xác định" });
      });
    };

    try {
      // --- 3. Kiểm tra Tồn Kho (CHECK STOCK) ---
      // Dùng Promise.all để check tất cả thuốc cùng lúc
      const stockChecks = chiTiet.map(item => {
        return new Promise((resolve, reject) => {
          // Lấy số lượng tồn hiện tại
          db.query("SELECT SoLuongTon FROM Thuoc WHERE MaThuoc = ?", [item.MaThuoc], (errCheck, rows) => {
            if (errCheck) return reject(errCheck);
            if (rows.length === 0) return reject(new Error(`Thuốc với mã ${item.MaThuoc} không tồn tại.`));
            
            const soLuongTon = rows[0].SoLuongTon;
            if (soLuongTon < item.SoLuong) {
              return reject(new Error(`Không đủ hàng cho thuốc ${item.MaThuoc}. (Tồn: ${soLuongTon}, Cần: ${item.SoLuong})`));
            }
            resolve(true);
          });
        });
      });
      
      // Chạy tất cả các kiểm tra
      await Promise.all(stockChecks);
      
      // Nếu tất cả đều qua (không bị reject), tiếp tục:

      // --- 4. Tạo MaPhieuXuat (PX001) ---
      const maxPxResult = await db.promise().query("SELECT MAX(MaPhieuXuat) AS maxId FROM PhieuXuat");
      let nextPxNumber = 1;
      const maxPxId = maxPxResult[0][0].maxId;
      if (maxPxId) {
        nextPxNumber = parseInt(maxPxId.slice(2)) + 1;
      }
      const MaPhieuXuat = "PX" + String(nextPxNumber).padStart(3, "0");
      const NgayXuat = new Date();

      // --- 5. Tính TongTien ---
      const TongTien = chiTiet.reduce((sum, item) => {
        return sum + (Number(item.SoLuong) * Number(item.DonGiaBan));
      }, 0);

      // --- 6. INSERT vào PhieuXuat ---
      const sqlPhieuXuat = `
        INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.promise().query(sqlPhieuXuat, [MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat]);

      // --- 7. INSERT vào ChiTietXuat (Bulk) ---
      const sqlChiTietXuat = `
        INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat)
        VALUES ?
      `;
      const chiTietXuatValues = chiTiet.map(item => [
        MaPhieuXuat,
        item.MaThuoc,
        item.SoLuong,
        item.DonGiaBan // (Theo CSDL 1.7)
      ]);
      await db.promise().query(sqlChiTietXuat, [chiTietXuatValues]);

      // --- 8. Tạo MaDonThuoc (DT001) ---
      const maxDtResult = await db.promise().query("SELECT MAX(MaDonThuoc) AS maxId FROM DonThuoc");
      let nextDtNumber = 1;
      const maxDtId = maxDtResult[0][0].maxId;
      if (maxDtId) {
        nextDtNumber = parseInt(maxDtId.slice(2)) + 1;
      }
      const MaDonThuoc = "DT" + String(nextDtNumber).padStart(3, "0");
      
      // --- 9. INSERT vào DonThuoc ---
      const sqlDonThuoc = `
        INSERT INTO DonThuoc (MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan, MaNhanVien)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(sqlDonThuoc, [MaDonThuoc, MaPhieuXuat, NgayXuat, TongTien, MaBenhNhan, MaNhanVien]);

      // --- 10. INSERT vào ChiTietDonThuoc (Bulk) ---
      const sqlChiTietDonThuoc = `
        INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, SoLuong, DonGiaBan)
        VALUES ?
      `;
      const chiTietDonThuocValues = chiTiet.map(item => [
        MaDonThuoc,
        item.MaThuoc,
        item.SoLuong,
        item.DonGiaBan // (Theo CSDL 1.11)
      ]);
      await db.promise().query(sqlChiTietDonThuoc, [chiTietDonThuocValues]);

      // --- 11. UPDATE Tồn Kho (Quan trọng) ---
      const updateStockPromises = chiTiet.map(item => {
        const sqlUpdateThuoc = `
          UPDATE Thuoc 
          SET SoLuongTon = SoLuongTon - ?
          WHERE MaThuoc = ?
        `;
        return db.promise().query(sqlUpdateThuoc, [item.SoLuong, item.MaThuoc]);
      });
      await Promise.all(updateStockPromises);

      // --- 12. COMMIT (Tất cả thành công) ---
      db.commit(errCommit => {
        if (errCommit) return rollback("Lỗi khi commit transaction", errCommit);
        
        res.status(201).json({ 
          message: "Xuất thuốc và tạo đơn thuốc thành công!",
          MaDonThuoc: MaDonThuoc,
          MaPhieuXuat: MaPhieuXuat,
          TongTien: TongTien
        });
      });

    } catch (transactionError) {
      // --- 13. ROLLBACK (Nếu có lỗi ở bước 3, 6, 7, 9, 10, 11) ---
      rollback(transactionError.message, transactionError);
    }
  });
});

export default router;