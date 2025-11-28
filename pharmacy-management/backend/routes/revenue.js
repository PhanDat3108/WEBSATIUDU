import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const { month, year } = req.query;
    const promiseDb = db.promise();

    // 1. Xây dựng điều kiện lọc thời gian
    let timeFilter = "";
    const params = [];

    // Lưu ý: Trong Database bạn đang lưu LoaiXuat là 'Bán' (có dấu)
    // Cần lọc đúng loại để không tính nhầm phiếu 'Bỏ'
    let baseCondition = "WHERE px.LoaiXuat = 'Bán'";

    if (month && year) {
      timeFilter = " AND MONTH(px.NgayXuat) = ? AND YEAR(px.NgayXuat) = ?";
      params.push(month, year);
    } else if (year) {
      timeFilter = " AND YEAR(px.NgayXuat) = ?";
      params.push(year);
    }

    // 2. Các câu Query (Sử dụng lại params cho từng câu)
    
    // Query 1: Tổng quan (Doanh thu, Vốn)
    const sqlSummary = `
      SELECT 
        SUM(px.TongTien) as totalRevenue,
        SUM(ctx.SoLuongXuat * t.GiaNhap) as totalCost
      FROM PhieuXuat px
      JOIN ChiTietXuat ctx ON px.MaPhieuXuat = ctx.MaPhieuXuat
      JOIN Thuoc t ON ctx.MaThuoc = t.MaThuoc
      ${baseCondition} ${timeFilter}
    `;

    // Query 2: Tổng số lượng bán
    const sqlSold = `
      SELECT SUM(ctx.SoLuongXuat) as totalSold
      FROM PhieuXuat px
      JOIN ChiTietXuat ctx ON px.MaPhieuXuat = ctx.MaPhieuXuat
      ${baseCondition} ${timeFilter}
    `;

    // Query 3: Biểu đồ (Group theo ngày)
    const sqlChart = `
      SELECT DATE_FORMAT(px.NgayXuat, '%Y-%m-%d') as date, SUM(px.TongTien) as value
      FROM PhieuXuat px
      ${baseCondition} ${timeFilter}
      GROUP BY DATE_FORMAT(px.NgayXuat, '%Y-%m-%d')
      ORDER BY date ASC
    `;

    // Query 4: Top sản phẩm bán chạy
    const sqlTop = `
      SELECT t.TenThuoc as name, SUM(ctx.SoLuongXuat) as value
      FROM PhieuXuat px
      JOIN ChiTietXuat ctx ON px.MaPhieuXuat = ctx.MaPhieuXuat
      JOIN Thuoc t ON ctx.MaThuoc = t.MaThuoc
      ${baseCondition} ${timeFilter}
      GROUP BY ctx.MaThuoc, t.TenThuoc
      ORDER BY value DESC
      LIMIT 5
    `;

    // Thực thi song song
    const [
      [summaryRows],
      [soldRows],
      [chartRows],
      [topRows]
    ] = await Promise.all([
      promiseDb.query(sqlSummary, params),
      promiseDb.query(sqlSold, params),
      promiseDb.query(sqlChart, params),
      promiseDb.query(sqlTop, params)
    ]);

    const revenue = Number(summaryRows[0]?.totalRevenue || 0);
    const cost = Number(summaryRows[0]?.totalCost || 0);
    const profit = revenue - cost;

    res.json({
      summary: {
        totalRevenue: revenue,
        profit: profit,
        totalSold: Number(soldRows[0]?.totalSold || 0),
      },
      chartData: chartRows,
      topProducts: topRows,
    });

  } catch (error) {
    console.error("Lỗi Server (Revenue):", error);
    res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu thống kê" });
  }
});

export default router;