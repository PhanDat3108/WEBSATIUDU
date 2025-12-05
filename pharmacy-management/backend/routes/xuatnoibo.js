import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API: THÊM PHIẾU XUẤT NỘI BỘ (BỎ / KHÁC / HẾT HẠN)
router.post("/add", async (req, res) => {
  const { MaNhanVien, LoaiXuat, chiTiet } = req.body;
  
  // Mặc định nếu không gửi LoaiXuat thì là 'Bỏ'
  const loaiXuatValue = LoaiXuat || 'Bỏ'; 

  // Chặn nếu cố tình gửi loại 'Bán' vào API này
  if (loaiXuatValue === 'Bán') {
    return res.status(400).json({ message: "Route này chỉ dành cho Xuất Bỏ/Hủy/Nội bộ." });
  }

  if (!MaNhanVien || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    return res.status(400).json({ message: "Thiếu thông tin nhân viên hoặc chi tiết thuốc." });
  }

  const conn = db.promise(); 

  const performRollback = async (error) => {
    if (conn) {
      await conn.rollback(); 
      console.error("ROLLBACK XUẤT NỘI BỘ.");
    }
    res.status(400).json({ message: error.message || "Lỗi xử lý giao dịch." });
  };
  
  try {
    await conn.beginTransaction(); 

    // 1. Xử lý FEFO và trừ kho (Logic giữ nguyên để trừ tồn kho đúng)
    for (const item of chiTiet) {
      const { MaThuoc, SoLuongXuat } = item; 
      const maThuocTrim = String(MaThuoc).trim();
      const soLuongYeuCau = Number(SoLuongXuat);

      // --- SỬA ĐỔI: Không cần lấy GiaNhap để tính tiền nữa ---
      // Chỉ kiểm tra thuốc có tồn tại không thôi
      const [thuocCheck] = await conn.query("SELECT MaThuoc FROM Thuoc WHERE MaThuoc = ?", [maThuocTrim]);
      if (thuocCheck.length === 0) throw new Error(`Thuốc ${maThuocTrim} không tồn tại.`);
      
      // Gán giá bằng 0 cho quy trình Xuất Bỏ
      item.DonGiaXuat = 0; 

      if (soLuongYeuCau <= 0 || isNaN(soLuongYeuCau)) {
        throw new Error(`Số lượng xuất cho thuốc ${maThuocTrim} không hợp lệ.`);
      }

      // Tìm lô và trừ tồn kho (FEFO)
      const [loThuocRows] = await conn.query(` 
        SELECT MaPhieuNhap, SoLuongConLai 
        FROM ChiTietNhap 
        WHERE MaThuoc = ? AND SoLuongConLai > 0 
        ORDER BY HanSuDung ASC
      `, [maThuocTrim]);

      let soLuongCanXuat = soLuongYeuCau;
      const tongTon = loThuocRows.reduce((acc, lo) => acc + Number(lo.SoLuongConLai), 0);

      if (tongTon < soLuongCanXuat) {
        throw new Error(`Thuốc ${maThuocTrim} không đủ hàng (Tồn lô: ${tongTon}).`);
      }

      // Vòng lặp trừ kho từng lô
      for (const lo of loThuocRows) {
        if (soLuongCanXuat === 0) break;
        let layTuLo = Math.min(Number(lo.SoLuongConLai), soLuongCanXuat);
        
        await conn.query(
          "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
          [layTuLo, lo.MaPhieuNhap, maThuocTrim]
        );
        soLuongCanXuat -= layTuLo;
      }
    }

    // 2. Tạo phiếu xuất
    const [maxRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
    const nextId = (maxRes[0].maxId || 0) + 1;
    const MaPhieuXuat = "PX" + String(nextId).padStart(3, "0");

    // --- SỬA ĐỔI: TỔNG TIỀN LUÔN LÀ 0 ---
    const TongTien = 0;
    
    await conn.query(
      "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, NOW(), ?, ?, ?)",
      [MaPhieuXuat, TongTien, MaNhanVien, loaiXuatValue]
    );

    // 3. Lưu chi tiết phiếu xuất (Với Đơn giá = 0)
    const chiTietValues = chiTiet.map(item => [
      MaPhieuXuat,
      String(item.MaThuoc).trim(),
      Number(item.SoLuongXuat),
      0 // --- SỬA ĐỔI: DonGiaXuat lưu vào DB là 0
    ]);
    
    await conn.query(
      "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES ?",
      [chiTietValues]
    );

    for (const item of chiTiet) {
       await conn.query(
        "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
        [Number(item.SoLuongXuat), String(item.MaThuoc).trim()]
      );
    }

    await conn.commit();
    console.log(`Đã tạo phiếu xuất nội bộ: ${MaPhieuXuat} (Tổng tiền: 0)`);
    
    res.status(201).json({ 
        message: `Xuất nội bộ thành công! Mã: ${MaPhieuXuat}`, 
        MaPhieuXuat,
        TongTien: 0 
    });

  } catch (e) {
    await performRollback(e);
  }
});

export default router;