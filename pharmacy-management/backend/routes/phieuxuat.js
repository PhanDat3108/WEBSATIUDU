import express from "express";
import db from "../config/db.js";

const router = express.Router();

// -----------------------------------------------------------------
// API 1: LẤY LỊCH SỬ PHIẾU XUẤT
// GET /api/v1/phieuxuat/list
// -----------------------------------------------------------------
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      px.MaPhieuXuat,
      px.NgayXuat,
      px.TongTien,
      px.LoaiXuat,
      nv.TenNhanVien
    FROM PhieuXuat px
    JOIN NhanVien nv ON px.MaNhanVien = nv.MaNhanVien
    ORDER BY px.NgayXuat DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi lấy danh sách phiếu xuất:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    res.json(rows);
  });
});

// -----------------------------------------------------------------
// API 2: XUẤT THUỐC (Áp dụng FEFO - First Expired First Out)
// POST /api/v1/phieuxuat/add
// -----------------------------------------------------------------
router.post("/add", (req, res) => {
  const { MaNhanVien, LoaiXuat, chiTiet } = req.body;

  // 1. Validate Input cơ bản
  if (!MaNhanVien || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin nhân viên hoặc chi tiết thuốc." });
  }

  // 2. Bắt đầu Transaction
  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khởi tạo giao dịch", error: err });

    const rollback = (msg) => {
      db.rollback(() => {
        console.error(msg);
        // Trả về 400 vì đây là lỗi logic (không đủ hàng, thiếu mã thuốc)
        res.status(400).json({ message: msg });
      });
    };

    try {
      // --- BƯỚC A: XỬ LÝ LOGIC FEFO & TRỪ KHO CHI TIẾT ---
      for (const item of chiTiet) {
        const { MaThuoc, SoLuong, DonGiaBan } = item;
        let soLuongCanXuat = Number(SoLuong);

        if (soLuongCanXuat <= 0) throw new Error(`Số lượng xuất cho thuốc ${MaThuoc} không hợp lệ.`);

        // A1. Tìm các lô thuốc còn hạn và còn hàng (Sắp xếp hạn dùng tăng dần)
        const [loThuoc] = await db.promise().query(`
          SELECT MaPhieuNhap, SoLuongConLai, HanSuDung 
          FROM ChiTietNhap 
          WHERE MaThuoc = ? AND SoLuongConLai > 0 
          ORDER BY HanSuDung ASC
        `, [MaThuoc]);

        // A2. Kiểm tra tổng tồn kho khả dụng
        const tongTonKhaDung = loThuoc.reduce((acc, lo) => acc + lo.SoLuongConLai, 0);
        if (tongTonKhaDung < soLuongCanXuat) {
          throw new Error(`Thuốc ${MaThuoc} không đủ hàng (Tồn lô: ${tongTonKhaDung}, Cần: ${soLuongCanXuat}).`);
        }

        // A3. Vòng lặp trừ kho từng lô (FEFO)
        for (const lo of loThuoc) {
          if (soLuongCanXuat === 0) break;

          let layTuLoNay = 0;
          if (lo.SoLuongConLai >= soLuongCanXuat) {
            layTuLoNay = soLuongCanXuat; 
            soLuongCanXuat = 0;
          } else {
            layTuLoNay = lo.SoLuongConLai; 
            soLuongCanXuat -= lo.SoLuongConLai;
          }

          // Cập nhật lại số lượng còn lại của lô nhập đó
          await db.promise().query(
            "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
            [layTuLoNay, lo.MaPhieuNhap, MaThuoc]
          );
        }
      }

      // --- BƯỚC B: TẠO PHIẾU XUẤT ---
      // B1. Tạo mã phiếu xuất (PXxxx)
      // [FIX TẠO ID] Dùng CAST(SUBSTRING...) an toàn hơn
      const [maxRes] = await db.promise().query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
      const nextId = (maxRes[0].maxId || 0) + 1;
      const MaPhieuXuat = "PX" + String(nextId).padStart(3, "0");

      // B2. Tính tổng tiền
      const TongTien = chiTiet.reduce((sum, item) => sum + (Number(item.SoLuong) * Number(item.DonGiaBan)), 0);
      const NgayXuat = new Date();

      // B3. Insert PhieuXuat
      await db.promise().query(
        "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, ?, ?, ?, ?)",
        [MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat || 'Bán']
      );

      // --- BƯỚC C: TẠO CHI TIẾT PHIẾU XUẤT ---
      const chiTietValues = chiTiet.map(item => [
        MaPhieuXuat,
        item.MaThuoc,
        item.SoLuong,
        item.DonGiaBan
      ]);
      
      await db.promise().query(
        "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES ?",
        [chiTietValues]
      );

      // --- BƯỚC D: CẬP NHẬT TỔNG TỒN KHO (BẢNG THUOC) ---
      const updatePromises = chiTiet.map(async item => {
        const [result] = await db.promise().query(
          "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
          [item.SoLuong, item.MaThuoc]
        );
        
        // [FIX CHÍNH] Kiểm tra nếu không có hàng nào bị ảnh hưởng
        if (result.affectedRows === 0) {
            // Điều này chỉ xảy ra nếu MaThuoc không tồn tại trong bảng Thuoc
            throw new Error(`Lỗi Logic: Không tìm thấy Mã Thuốc ${item.MaThuoc} trong bảng Thuoc để cập nhật tổng tồn.`);
        }
        return true;
      });
      
      await Promise.all(updatePromises);

      // --- BƯỚC E: COMMIT ---
      db.commit((errCommit) => {
        if (errCommit) return rollback("Lỗi khi commit transaction");
        
        res.status(201).json({ 
          message: "Xuất thuốc thành công!",
          MaPhieuXuat,
          TongTien
        });
      });

    } catch (e) {
      // Dùng e.message để lấy thông báo lỗi chính xác
      rollback(e.message || "Lỗi xử lý giao dịch", e);
    }
  });
});

export default router;