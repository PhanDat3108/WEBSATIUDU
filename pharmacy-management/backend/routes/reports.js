import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API 1: Lấy dữ liệu cho biểu đồ tròn (Tình trạng hạn sử dụng)
router.get("/expiry-status", (req, res) => {
  const SAP_HET_HAN_DAYS = 30; 

  const sql = `
    SELECT
      CASE
        WHEN HanSuDung < CURDATE() THEN 'DaHetHan'
        WHEN HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) THEN 'SapHetHan'
        ELSE 'BinhThuong'
      END AS TinhTrang,
      -- Chỉ tính tổng số lượng CÒN LẠI trong kho, không tính số lượng nhập ban đầu
      SUM(SoLuongConLai) AS TongSoLuongTon 
    FROM ChiTietNhap
    WHERE SoLuongConLai > 0 -- [QUAN TRỌNG] Chỉ lấy các lô còn hàng
    GROUP BY TinhTrang
  `;

  db.query(sql, [SAP_HET_HAN_DAYS], (err, result) => {
    if (err) {
      console.error("Lỗi biểu đồ report:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    const responseData = {
      BinhThuong: 0,
      SapHetHan: 0,
      DaHetHan: 0,
    };

    result.forEach((row) => {
      // Ép kiểu về number để đảm bảo biểu đồ hiển thị được
      const value = Number(row.TongSoLuongTon);
      if (row.TinhTrang === 'BinhThuong') responseData.BinhThuong = value;
      if (row.TinhTrang === 'SapHetHan') responseData.SapHetHan = value;
      if (row.TinhTrang === 'DaHetHan') responseData.DaHetHan = value;
    });

    res.json(responseData);
  });
});

// API 2: Lấy báo cáo tổng quan tồn kho
router.get("/tonkho", async (req, res) => {
  try {
    // 1. Tổng quan: Tổng số loại thuốc và tổng lượng tồn kho (dựa trên bảng Thuoc)
    const querySummary = new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS TongLoai, SUM(SoLuongTon) AS TongTon FROM Thuoc",
        (err, res) => (err ? reject(err) : resolve(res[0]))
      );
    });

    // 2. Thuốc sắp hết hàng (Dựa trên định mức tồn kho <= 10)
    const querySapHetHang = new Promise((resolve, reject) => {
      db.query(
        "SELECT MaThuoc, TenThuoc, SoLuongTon, DonViTinh FROM Thuoc WHERE SoLuongTon <= 10 AND SoLuongTon > 0 ORDER BY SoLuongTon ASC",
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });

    // 3. Thuốc sắp hết hạn (Trong 30 ngày tới) - Chỉ lấy lô còn hàng
    const querySapHetHan = new Promise((resolve, reject) => {
       const sql = `
        SELECT 
            t.MaThuoc, 
            t.TenThuoc, 
            ctn.SoLuongConLai as SoLuongTon, -- Hiển thị số lượng tồn của lô đó
            ctn.HanSuDung,
            t.DonViTinh
        FROM ChiTietNhap ctn
        JOIN Thuoc t ON ctn.MaThuoc = t.MaThuoc
        WHERE ctn.HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND ctn.SoLuongConLai > 0 -- [QUAN TRỌNG] Không báo cáo lô đã bán hết
        ORDER BY ctn.HanSuDung ASC
       `;
       db.query(sql, (err, res) => (err ? reject(err) : resolve(res)));
    });

    // 4. Thuốc đã hết hạn - Chỉ lấy lô còn hàng (cần tiêu hủy)
    const queryDaHetHan = new Promise((resolve, reject) => {
        const sql = `
         SELECT 
            t.MaThuoc, 
            t.TenThuoc, 
            ctn.SoLuongConLai as SoLuongTon, -- Hiển thị số lượng tồn của lô đó
            ctn.HanSuDung,
            t.DonViTinh
         FROM ChiTietNhap ctn
         JOIN Thuoc t ON ctn.MaThuoc = t.MaThuoc
         WHERE ctn.HanSuDung < CURDATE()
           AND ctn.SoLuongConLai > 0 -- [QUAN TRỌNG] Không báo cáo lô đã bán hết
         ORDER BY ctn.HanSuDung ASC
        `;
        db.query(sql, (err, res) => (err ? reject(err) : resolve(res)));
     });

    const [summary, sapHetHang, sapHetHan, daHetHan] = await Promise.all([
      querySummary,
      querySapHetHang,
      querySapHetHan,
      queryDaHetHan
    ]);

    res.json({
      TongSoLoaiThuoc: summary.TongLoai || 0,
      TongSoLuongTon: summary.TongTon || 0,
      ThuocSapHetHang: sapHetHang,
      ThuocSapHetHan: sapHetHan,
      ThuocDaHetHan: daHetHan
    });

  } catch (error) {
    console.error("Lỗi API /tonkho:", error);
    res.status(500).json({ message: "Lỗi khi lấy báo cáo tồn kho" });
  }
});

export default router;