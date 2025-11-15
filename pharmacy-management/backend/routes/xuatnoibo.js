import express from "express";
import db from "../config/db.js";

const router = express.Router();

// -----------------------------------------------------------------
// API 1: LẤY LỊCH SỬ XUẤT NỘI BỘ (Bỏ / Khác)
// GET /api/v1/xuatnoibo/details
// -----------------------------------------------------------------
router.get("/details", (req, res) => {
  const sql = `
    SELECT 
      px.MaPhieuXuat,
      px.NgayXuat,
      px.LoaiXuat,
      t.TenThuoc,
      ctx.SoLuongXuat,
      ctx.DonGiaXuat,
      nv.TenNhanVien
    FROM ChiTietXuat ctx
    JOIN Thuoc t ON ctx.MaThuoc = t.MaThuoc
    JOIN PhieuXuat px ON ctx.MaPhieuXuat = px.MaPhieuXuat
    JOIN NhanVien nv ON px.MaNhanVien = nv.MaNhanVien
    WHERE px.LoaiXuat = 'Bỏ' OR px.LoaiXuat = 'Khác'
    ORDER BY px.NgayXuat DESC, px.MaPhieuXuat DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy lịch sử xuất nội bộ:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    res.json(rows);
  });
});

// -----------------------------------------------------------------
// API 2: THÊM 1 PHIẾU XUẤT NỘI BỘ MỚI (Transaction)
// POST /api/v1/xuatnoibo/add
// -----------------------------------------------------------------
router.post("/add", (req, res) => {
  /*
    Payload dự kiến:
    {
      "MaNhanVien": "NV001",
      "LoaiXuat": "Bỏ", // "Bỏ" hoặc "Khác"
      "chiTiet": [
        { "MaThuoc": "T001", "SoLuongXuat": 1, "DonGiaXuat": 50000 }, // DonGiaXuat là GiaNhap (giá vốn)
        { "MaThuoc": "T002", "SoLuongXuat": 2, "DonGiaXuat": 120000 }
      ]
    }
  */
  const { MaNhanVien, LoaiXuat, chiTiet } = req.body;

  // --- 1. Validate Input ---
  if (!MaNhanVien || !LoaiXuat || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin (NV, Loại xuất, hoặc chi tiết thuốc)." });
  }
  if (LoaiXuat === 'Bán') {
    return res.status(400).json({ message: "Loại xuất 'Bán' không được phép ở đây. Vui lòng dùng chức năng Bán Hàng." });
  }

  // --- 2. Bắt đầu Transaction ---
  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi bắt đầu transaction", error: err });

    const rollback = (errorMsg, originalError) => {
      db.rollback(() => {
        console.error(errorMsg, originalError);
        res.status(500).json({ message: errorMsg, error: originalError ? originalError.message : "Lỗi không xác định" });
      });
    };

    try {
      // --- 3. Kiểm tra Tồn Kho (CHECK STOCK) ---
      const stockChecks = chiTiet.map(item => {
        return new Promise((resolve, reject) => {
          db.query("SELECT TenThuoc, SoLuongTon FROM Thuoc WHERE MaThuoc = ?", [item.MaThuoc], (errCheck, rows) => {
            if (errCheck) return reject(errCheck);
            if (rows.length === 0) return reject(new Error(`Thuốc ${item.MaThuoc} không tồn tại.`));
            
            const { TenThuoc, SoLuongTon } = rows[0];
            if (SoLuongTon < item.SoLuongXuat) {
              return reject(new Error(`Không đủ hàng cho ${TenThuoc}. (Tồn: ${SoLuongTon}, Cần: ${item.SoLuongXuat})`));
            }
            resolve(true);
          });
        });
      });
      await Promise.all(stockChecks);

      // --- 4. Tạo MaPhieuXuat (PX001) ---
      const maxPxResult = await db.promise().query("SELECT MAX(MaPhieuXuat) AS maxId FROM PhieuXuat");
      let nextPxNumber = 1;
      const maxPxId = maxPxResult[0][0].maxId;
      if (maxPxId) {
        nextPxNumber = parseInt(maxPxId.slice(2)) + 1;
      }
      const MaPhieuXuat = "PX" + String(nextPxNumber).padStart(3, "0");
      const NgayXuat = new Date();

      // --- 5. Tính TongTien (Tổng giá trị hàng bị Bỏ/Xuất) ---
      const TongTien = chiTiet.reduce((sum, item) => {
        return sum + (Number(item.SoLuongXuat) * Number(item.DonGiaXuat));
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
        item.SoLuongXuat,
        item.DonGiaXuat
      ]);
      await db.promise().query(sqlChiTietXuat, [chiTietXuatValues]);

      // --- 8. UPDATE Tồn Kho (Trừ kho) ---
      const updateStockPromises = chiTiet.map(item => {
        const sqlUpdateThuoc = `
          UPDATE Thuoc 
          SET SoLuongTon = SoLuongTon - ?
          WHERE MaThuoc = ?
        `;
        return db.promise().query(sqlUpdateThuoc, [item.SoLuongXuat, item.MaThuoc]);
      });
      await Promise.all(updateStockPromises);

      // --- 9. COMMIT (Tất cả thành công) ---
      db.commit(errCommit => {
        if (errCommit) return rollback("Lỗi khi commit transaction", errCommit);
        
        res.status(201).json({ 
          message: "Xuất kho nội bộ thành công!",
          MaPhieuXuat: MaPhieuXuat,
          TongTien: TongTien
        });
      });

    } catch (transactionError) {
      // --- 10. ROLLBACK (Nếu có lỗi ở bước 3, 6, 7, 8) ---
      rollback(transactionError.message, transactionError);
    }
  });
});

export default router;