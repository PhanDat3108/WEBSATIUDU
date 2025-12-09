// backend/routes/donthuoc.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// API: TẠO ĐƠN THUỐC (BÁN HÀNG) + TỰ TẠO PHIẾU XUẤT
router.post("/create", async (req, res) => {
  const { MaNhanVien, MaBenhNhan, chiTiet } = req.body;

  if (!MaNhanVien || !chiTiet || chiTiet.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn thuốc không hợp lệ" });
  }

  // Dùng db.promise() cho kết nối đơn
  const conn = db.promise();

  try {
    await conn.beginTransaction();

    // 1. Tính tổng tiền & Ngày lập
    const TongTien = chiTiet.reduce((sum, item) => sum + (Number(item.SoLuong) * Number(item.GiaBan)), 0);
    const NgayLap = new Date();

    // 2. Tạo Mã Phiếu Xuất
    const [pxRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
    const nextPxId = (pxRes[0].maxId || 0) + 1;
    const MaPhieuXuat = "PX" + String(nextPxId).padStart(3, "0");

    // 3. Insert Phiếu Xuất
    await conn.query(
      "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, ?, ?, ?, 'Bán')",
      [MaPhieuXuat, NgayLap, TongTien, MaNhanVien]
    );

    // 4. Tạo Mã Đơn Thuốc
    const [dtRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaDonThuoc, 3) AS UNSIGNED)) AS maxId FROM DonThuoc");
    const nextDtId = (dtRes[0].maxId || 0) + 1;
    const MaDonThuoc = "DT" + String(nextDtId).padStart(3, "0");

    // 5. Insert Đơn Thuốc
    await conn.query(
      "INSERT INTO DonThuoc (MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan, MaNhanVien) VALUES (?, ?, ?, ?, ?, ?)",
      [MaDonThuoc, MaPhieuXuat, NgayLap, TongTien, MaBenhNhan || null, MaNhanVien]
    );

    // 6. Xử lý từng thuốc (QUAN TRỌNG: LOGIC TRỪ KHO)
    for (const item of chiTiet) {
      const maThuoc = item.MaThuoc;
      let soLuongCanBan = Number(item.SoLuong); // Tổng số lượng khách mua
      const donGiaBan = Number(item.GiaBan);

      

      // A. Insert vào ChiTietXuat (Lịch sử bán - 1 dòng duy nhất)
      await conn.query(
        "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES (?, ?, ?, ?)",
        [MaPhieuXuat, maThuoc, soLuongCanBan, donGiaBan]
      );

      // B. Lấy danh sách lô hàng còn tồn (Sắp xếp hạn sử dụng tăng dần)
      const [loHang] = await conn.query(
        "SELECT MaPhieuNhap, SoLuongConLai FROM ChiTietNhap WHERE MaThuoc = ? AND SoLuongConLai > 0 ORDER BY HanSuDung ASC",
        [maThuoc]
      );

      // Check tổng tồn kho
      const tongTon = loHang.reduce((acc, lo) => acc + Number(lo.SoLuongConLai), 0);
      if (tongTon < soLuongCanBan) {
        throw new Error(`Thuốc ${maThuoc} không đủ hàng (Tồn: ${tongTon}, Cần: ${soLuongCanBan})`);
      }

      for (const lo of loHang) {
        if (soLuongCanBan <= 0) {
           
            break; 
        }

        const slTrongLo = Number(lo.SoLuongConLai);
        const maPhieuNhap = lo.MaPhieuNhap;

        const layTuLoNay = Math.min(slTrongLo, soLuongCanBan);

       

        await conn.query(
          "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
          [layTuLoNay, maPhieuNhap, maThuoc]
        );

        soLuongCanBan -= layTuLoNay;
      }

      // D. Lưu vào ChiTietDonThuoc
      await conn.query(
        "INSERT INTO ChiTietDonThuoc (MaDonThuoc, MaThuoc, SoLuong, DonGiaBan) VALUES (?, ?, ?, ?)",
        [MaDonThuoc, maThuoc, Number(item.SoLuong), donGiaBan]
      );

      await conn.query(
        "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
        [Number(item.SoLuong), maThuoc]
      );
    }

    await conn.commit();
    
    
    res.status(201).json({ 
      message: "Xuất đơn thuốc thành công!", 
      MaDonThuoc, 
      MaPhieuXuat,
      TongTien 
    });

  } catch (err) {
    await conn.rollback();
    console.error("Lỗi Transaction:", err);
    res.status(500).json({ message: "Lỗi khi tạo đơn thuốc", error: err.message });
  }
});
  // API Lấy lịch sử đơn thuốc
  router.get("/", async (req, res) => {
      try {
          const sql = `
              SELECT 
                  dt.MaDonThuoc, dt.NgayLap, dt.TongTien, dt.MaPhieuXuat,
                  bn.TenBenhNhan, bn.SoDienThoai,
                  nv.TenNhanVien
              FROM DonThuoc dt
              LEFT JOIN BenhNhan bn ON dt.MaBenhNhan = bn.MaBenhNhan
              LEFT JOIN NhanVien nv ON dt.MaNhanVien = nv.MaNhanVien
              ORDER BY dt.NgayLap DESC
          `;
          const [rows] = await db.promise().query(sql);
          res.json(rows);
      } catch (err) {
          res.status(500).json({message: "Lỗi tải danh sách đơn thuốc"});
      }
  });

  export default router;