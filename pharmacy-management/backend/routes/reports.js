import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API 1: Lấy dữ liệu cho biểu đồ tròn (Tình trạng hạn sử dụng)
// Logic: Dựa trên bảng ChiTietNhap để biết lô nào hết hạn/sắp hết hạn
router.get("/expiry-status", (req, res) => {
  const SAP_HET_HAN_DAYS = 30; // Cảnh báo trước 30 ngày

  const sql = `
    SELECT
      CASE
        WHEN HanSuDung < CURDATE() THEN 'DaHetHan'
        WHEN HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) THEN 'SapHetHan'
        ELSE 'BinhThuong'
      END AS TinhTrang,
      COUNT(*) as SoLuongLo, -- Đếm số lượng lô thuốc (batch)
      SUM(SoLuongNhap) AS TongSoLuongNhap -- Hoặc tính theo tổng số lượng nhập
    FROM ChiTietNhap
    GROUP BY TinhTrang
  `;

  db.query(sql, [SAP_HET_HAN_DAYS], (err, result) => {
    if (err) {
      console.error("Lỗi biểu đồ report:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    // Format dữ liệu trả về cho Frontend dễ dùng
    const responseData = {
      BinhThuong: 0,
      SapHetHan: 0,
      DaHetHan: 0,
    };

    result.forEach((row) => {
      if (row.TinhTrang === 'BinhThuong') responseData.BinhThuong = row.TongSoLuongNhap;
      if (row.TinhTrang === 'SapHetHan') responseData.SapHetHan = row.TongSoLuongNhap;
      if (row.TinhTrang === 'DaHetHan') responseData.DaHetHan = row.TongSoLuongNhap;
    });

    res.json(responseData);
  });
});

// API 2: Lấy báo cáo tổng quan tồn kho (Số liệu tổng & Danh sách cảnh báo)
router.get("/tonkho", async (req, res) => {
  try {
    // Chúng ta sẽ chạy nhiều query song song bằng Promise để lấy đủ dữ liệu
    
    // 1. Lấy tổng số loại thuốc và tổng lượng tồn kho
    const querySummary = new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS TongLoai, SUM(SoLuongTon) AS TongTon FROM Thuoc",
        (err, res) => (err ? reject(err) : resolve(res[0]))
      );
    });

    // 2. Lấy danh sách thuốc sắp hết hàng (Ví dụ: Tồn kho <= 10)
    const querySapHetHang = new Promise((resolve, reject) => {
      db.query(
        "SELECT MaThuoc, TenThuoc, SoLuongTon, DonViTinh FROM Thuoc WHERE SoLuongTon <= 10 ORDER BY SoLuongTon ASC",
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });

    // 3. Lấy danh sách thuốc sắp hết hạn (Trong 30 ngày tới)
    const querySapHetHan = new Promise((resolve, reject) => {
       const sql = `
        SELECT DISTINCT t.MaThuoc, t.TenThuoc, t.SoLuongTon, ctn.HanSuDung
        FROM ChiTietNhap ctn
        JOIN Thuoc t ON ctn.MaThuoc = t.MaThuoc
        WHERE ctn.HanSuDung BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY ctn.HanSuDung ASC
       `;
       db.query(sql, (err, res) => (err ? reject(err) : resolve(res)));
    });

    // 4. Lấy danh sách thuốc đã hết hạn
    const queryDaHetHan = new Promise((resolve, reject) => {
        const sql = `
         SELECT DISTINCT t.MaThuoc, t.TenThuoc, t.SoLuongTon, ctn.HanSuDung
         FROM ChiTietNhap ctn
         JOIN Thuoc t ON ctn.MaThuoc = t.MaThuoc
         WHERE ctn.HanSuDung < CURDATE()
         ORDER BY ctn.HanSuDung ASC
        `;
        db.query(sql, (err, res) => (err ? reject(err) : resolve(res)));
     });

    // Chạy tất cả và đợi kết quả
    const [summary, sapHetHang, sapHetHan, daHetHan] = await Promise.all([
      querySummary,
      querySapHetHang,
      querySapHetHan,
      queryDaHetHan
    ]);

    // Trả về 1 object tổng hợp
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