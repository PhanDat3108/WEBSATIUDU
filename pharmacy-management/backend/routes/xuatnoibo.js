import express from "express";
import db from "../config/db.js";

const router = express.Router();
console.log(">>> [LOG] Router XuatNoiBo đã được load.");


// -----------------------------------------------------------------
// API 2: THÊM PHIẾU XUẤT NỘI BỘ (ĐÃ SỬA LỖI MISMATCH FIELD)
// -----------------------------------------------------------------
router.post("/add", async (req, res) => {
  const { MaNhanVien, LoaiXuat, chiTiet } = req.body;
  const loaiXuatValue = LoaiXuat || 'Bỏ'; 

  console.log("--- BẮT ĐẦU GIAO DỊCH XUẤT NỘI BỘ ---");
  console.log("Dữ liệu nhận được:", { MaNhanVien, LoaiXuat, chiTiet });

  if (!MaNhanVien || !chiTiet || !Array.isArray(chiTiet) || chiTiet.length === 0) {
    console.error("Lỗi: Thiếu thông tin đầu vào");
    return res.status(400).json({ message: "Thiếu thông tin nhân viên hoặc chi tiết thuốc." });
  }

  // LẤY PROMISE CONNECTION TRỰC TIẾP TỪ KẾT NỐI ĐƠN
  const conn = db.promise(); 

  // Hàm rollback (đã sửa lỗi scope)
  const performRollback = async (error) => {
    if (conn) {
      await conn.rollback(); 
      console.error("BƯỚC 6: ROLLBACK THỰC HIỆN.");
      console.error("Lỗi chi tiết:", error.message || error);
      if (error.sqlMessage) {
           console.error("SQL Message:", error.sqlMessage);
           console.error("SQL Query:", error.sql);
      }
    }
    res.status(400).json({ message: error.message || "Lỗi xử lý giao dịch. Vui lòng kiểm tra log máy chủ." });
  };
  
  try {
    // 2. Bắt đầu Transaction trên kết nối đơn
    await conn.beginTransaction(); 
    console.log("BƯỚC 1: Bắt đầu Transaction thành công.");

    // --- BƯỚC A: XỬ LÝ LOGIC FEFO & TRỪ KHO CHI TIẾT LÔ HÀNG (ChiTietNhap) ---
    console.log("BƯỚC 2: Bắt đầu xử lý FEFO và trừ tồn lô.");
    let itemIndex = 0;
    for (const item of chiTiet) {
      itemIndex++;
      // ĐÃ SỬA: Giữ SoLuongXuat trong destructuring, lỗi NaN sẽ được bắt ở if bên dưới
      const { MaThuoc, SoLuongXuat } = item; 
      const maThuocTrim = String(MaThuoc).trim();
      const soLuongYeuCau = Number(SoLuongXuat); // Lấy giá trị số lượng yêu cầu

      // Lấy GiaNhap
      const [thuocData] = await conn.query("SELECT GiaNhap FROM Thuoc WHERE MaThuoc = ?", [maThuocTrim]);
      if (thuocData.length === 0) {
          throw new Error(`Mã Thuốc ${maThuocTrim} không tồn tại trong bảng Thuoc.`); 
      }
      const donGiaXuat = Number(thuocData[0].GiaNhap); 
      item.DonGiaXuat = donGiaXuat;

      console.log(`--- Đang xử lý mục ${itemIndex}: Mã Thuốc: ${maThuocTrim}, SL Yêu cầu: ${soLuongYeuCau}, Giá vốn: ${donGiaXuat} ---`);

      // Lỗi hiện tại xảy ra ở đây: soLuongYeuCau là NaN hoặc <= 0
      if (soLuongYeuCau <= 0 || isNaN(soLuongYeuCau)) {
        // Nếu MaThuoc là 'TNaN', lỗi này đang được kích hoạt.
        throw new Error(`Số lượng xuất cho thuốc ${maThuocTrim} không hợp lệ.`);
      }

      // A1. Tìm các lô thuốc còn hạn và còn hàng (FEFO)
      const [loThuocRows] = await conn.query(` 
        SELECT MaPhieuNhap, SoLuongConLai, HanSuDung 
        FROM ChiTietNhap 
        WHERE MaThuoc = ? AND SoLuongConLai > 0 
        ORDER BY HanSuDung ASC
      `, [maThuocTrim]);

      const loThuoc = loThuocRows.map(lo => ({ ...lo, SoLuongConLai: Number(lo.SoLuongConLai) }));
      
      console.log(`A1. Kết quả truy vấn lô hàng (${loThuoc.length} lô tìm thấy):`, loThuoc);
      
      let soLuongCanXuat = soLuongYeuCau; 
      
      // A2. Kiểm tra tổng tồn kho khả dụng
      const tongTonKhaDung = loThuoc.reduce((acc, lo) => acc + lo.SoLuongConLai, 0);

      if (tongTonKhaDung < soLuongCanXuat) {
        throw new Error(`Thuốc ${maThuocTrim} không đủ hàng (Tồn lô: ${tongTonKhaDung}, Cần: ${soLuongCanXuat}).`);
      }
      console.log(`A2. Tổng tồn khả dụng: ${tongTonKhaDung}. Đủ để xuất hàng.`);


      // A3. Vòng lặp trừ kho từng lô (FEFO)
      let lotIndex = 0;
      for (const lo of loThuoc) {
        if (soLuongCanXuat === 0) break; 

        lotIndex++;
        let layTuLoNay = 0;
        
        if (lo.SoLuongConLai >= soLuongCanXuat) {
          layTuLoNay = soLuongCanXuat; 
          soLuongCanXuat = 0; 
        } else {
          layTuLoNay = lo.SoLuongConLai; 
          soLuongCanXuat -= lo.SoLuongConLai; 
        }
        
        console.log(`  A3. Lô ${lo.MaPhieuNhap}: Tồn ban đầu: ${lo.SoLuongConLai}, Lấy ra: ${layTuLoNay}, Còn phải lấy: ${soLuongCanXuat}`);

        if (layTuLoNay > 0) {
            // Cập nhật lại số lượng còn lại của lô nhập đó
            const [updateLotResult] = await conn.query(
              "UPDATE ChiTietNhap SET SoLuongConLai = SoLuongConLai - ? WHERE MaPhieuNhap = ? AND MaThuoc = ?",
              [layTuLoNay, lo.MaPhieuNhap, maThuocTrim]
            );
            
            console.log(`  A3.1. Kết quả UPDATE ChiTietNhap: Rows Affected: ${updateLotResult.affectedRows}`);

            if (updateLotResult.affectedRows === 0) {
                throw new Error(`Lỗi cập nhật tồn lô. Mã lô: ${lo.MaPhieuNhap}.`); 
            }
        }
      }
      
      if (soLuongCanXuat > 0) {
          throw new Error(`Lỗi logic: Không lấy đủ số lượng thuốc ${maThuocTrim}. Còn thiếu ${soLuongCanXuat}.`);
      }
    }
    console.log("BƯỚC 2: Xử lý FEFO và trừ tồn lô (ChiTietNhap) thành công.");


    // --- BƯỚC B: TẠO PHIẾU XUẤT ---
    console.log("BƯỚC 3: Bắt đầu tạo Phiếu Xuất (PhieuXuat).");
    const [maxRes] = await conn.query("SELECT MAX(CAST(SUBSTRING(MaPhieuXuat, 3) AS UNSIGNED)) AS maxId FROM PhieuXuat WHERE MaPhieuXuat LIKE 'PX%'");
    const nextId = (maxRes[0].maxId || 0) + 1;
    const MaPhieuXuat = "PX" + String(nextId).padStart(3, "0");

    // ĐÃ SỬA: Sử dụng SoLuongXuat để tính tổng tiền
    const TongTien = chiTiet.reduce((sum, item) => sum + (Number(item.SoLuongXuat) * Number(item.DonGiaXuat)), 0);
    const NgayXuat = new Date();

    console.log(`B1/B2. Mã Phiếu Xuất: ${MaPhieuXuat}, Tổng giá vốn: ${TongTien}`);

    await conn.query(
      "INSERT INTO PhieuXuat (MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, LoaiXuat) VALUES (?, ?, ?, ?, ?)",
      [MaPhieuXuat, NgayXuat, TongTien, MaNhanVien, loaiXuatValue]
    );
    console.log("B3. Insert Phiếu Xuất thành công.");

    // --- BƯỚC C: TẠO CHI TIẾT PHIẾU XUẤT ---
    console.log("BƯỚC 4: Bắt đầu tạo Chi Tiết Phiếu Xuất (ChiTietXuat).");
    const chiTietValues = chiTiet.map(item => [
      MaPhieuXuat,
      String(item.MaThuoc).trim(),
      Number(item.SoLuongXuat),
      Number(item.DonGiaXuat) 
    ]);
    
    await conn.query(
      "INSERT INTO ChiTietXuat (MaPhieuXuat, MaThuoc, SoLuongXuat, DonGiaXuat) VALUES ?",
      [chiTietValues]
    );
    console.log("BƯỚC 4: Insert Chi Tiết Phiếu Xuất thành công.");


    // --- BƯỚC D: CẬP NHẬT TỔNG TỒN KHO (BẢNG THUOC) ---
    console.log("BƯỚC 5: Bắt đầu cập nhật tổng tồn kho (Thuoc.SoLuongTon).");
    
    const updatePromises = chiTiet.map(async item => {
      const maThuoc = String(item.MaThuoc).trim();
      
      // ĐÃ SỬA LỖI CŨ: Sử dụng SoLuongXuat thay vì item.SoLuong
      const soLuong = Number(item.SoLuongXuat);
      
      const [result] = await conn.query(
        "UPDATE Thuoc SET SoLuongTon = SoLuongTon - ? WHERE MaThuoc = ?",
        [soLuong, maThuoc]
      );
      
      console.log(`  D. Kết quả UPDATE Thuoc (MaThuoc: ${maThuoc}, SL trừ: ${soLuong}): Rows Affected: ${result.affectedRows}`);
      
      if (result.affectedRows === 0) {
          throw new Error(`Lỗi Logic: Không tìm thấy Mã Thuốc ${maThuoc} để cập nhật tổng tồn kho.`);
      }
      return true;
    });
    
    await Promise.all(updatePromises);
    console.log("BƯỚC 5: Cập nhật tổng tồn kho thành công cho tất cả các mặt hàng.");


    // --- BƯỚC E: COMMIT ---
    await conn.commit();
    console.log("BƯỚC 7: COMMIT TRANSACTION THÀNH CÔNG.");
    
    res.status(201).json({ 
      message: `Xuất nội bộ thành công! Mã PX: ${MaPhieuXuat}`,
      MaPhieuXuat,
      TongTien
    });

  } catch (e) {
    // Bắt lỗi từ bất kỳ bước nào và Rollback
    await performRollback(e);
  } finally {
    // KHÔNG GỌI conn.release() vì đây là Single Connection toàn cục.
    console.log("--- KẾT THÚC GIAO DỊCH XUẤT NỘI BỘ (Không release connection) ---");
  }
});

export default router;