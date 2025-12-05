import express from "express";
import db from "../config/db.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

//Router thêm thuốc
router.post("/add", (req, res) => {
  const { TenThuoc, DonViTinh, MaLoai, MaNhaCungCap, GiaBan } = req.body;

  if (!TenThuoc || !DonViTinh || !MaLoai || !MaNhaCungCap) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  // [FIX 1] Sửa logic tìm MAX ID
  // Lấy phần SỐ của MaThuoc (ví dụ T009 -> 9), cast sang SỐ (UNSIGNED)
  // và tìm MAX của SỐ đó. Chỉ áp dụng cho các mã bắt đầu bằng 'T'.
  const maxIdQuery = "SELECT MAX(CAST(SUBSTRING(MaThuoc, 2) AS UNSIGNED)) AS maxNumber FROM Thuoc WHERE MaThuoc LIKE 'T%'";

  db.query(maxIdQuery, (err, result) => {
    try {
      if (err) {
        console.error("Lỗi DB khi tạo mã thuốc:", err);
        return res.status(500).json({ message: "Lỗi DB khi tạo mã thuốc" });
      }

      // result[0].maxNumber sẽ là 9, 10, 99, 100... hoặc NULL nếu bảng rỗng
      let maxNumber = (result && result.length > 0) ? result[0].maxNumber : 0;
      
      // Nếu maxNumber là null (bảng rỗng), gán = 0
      if (maxNumber === null) {
        maxNumber = 0;
      }

      let nextNumber = maxNumber + 1;

      const MaThuoc = "T" + String(nextNumber).padStart(3, "0");

      const sql = `
        INSERT INTO Thuoc (
          MaThuoc, TenThuoc, DonViTinh, MaLoai, MaNhaCungCap,
          SoLuongTon, GiaNhap, GiaBan
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          MaThuoc,
          TenThuoc,
          DonViTinh,
          MaLoai,
          MaNhaCungCap,
          0,
          0,
          GiaBan || 0
        ],
        (err2) => {
          // [FIX 2] Phân biệt lỗi ER_DUP_ENTRY
          if (err2) {
            console.error("Lỗi khi thêm thuốc:", err2); 
            
            if (err2.code === 'ER_DUP_ENTRY') {
              // Kiểm tra xem lỗi trùng là do Khóa chính (MaThuoc) hay Khóa UNIQUE (TenThuoc)
              // (Giả sử TenThuoc là UNIQUE)
              if (err2.message.includes('PRIMARY')) {
                 return res.status(500).json({ 
                   message: `Lỗi Logic: Bị trùng Mã Thuốc (${MaThuoc}). Vui lòng thử lại!` 
                 });
              } else {
                 // Nếu không phải PRIMARY, giả sử là lỗi trùng tên
                 return res.status(409).json({ message: "Lỗi: Tên thuốc này đã tồn tại!" });
              }
            }
            
            if (err2.code === 'ER_NO_REFERENCED_ROW_2') {
               return res.status(400).json({ message: "Lỗi: Loại thuốc hoặc Nhà cung cấp không hợp lệ!" });
            }

            return res.status(500).json({ message: "Lỗi máy chủ khi thêm thuốc!" });
          }
          
          return res.status(201).json({ message: "Thêm thuốc thành công!", MaThuoc });
        }
      );

    } catch (syncError) {
      console.error("Lỗi xử lý đồng bộ tại /add:", syncError);
      return res.status(500).json({ message: "Lỗi server không xác định." });
    }
  });
});

//sửa thuốc
router.put("/fix/:MaThuoc", (req, res) => {
  const { MaThuoc } = req.params;
  const { TenThuoc, DonViTinh, MaLoai, MaNhaCungCap, GiaBan } = req.body;

  if (!MaThuoc) return res.status(400).json({ message: "Thiếu mã thuốc để sửa!" });

  const sql = `
    UPDATE Thuoc
    SET 
      TenThuoc = ?, 
      DonViTinh = ?, 
      MaLoai = ?, 
      MaNhaCungCap = ?,
      GiaBan = ?
    WHERE MaThuoc = ?
  `;
  
  db.query(sql, [TenThuoc, DonViTinh, MaLoai, MaNhaCungCap, GiaBan || 0, MaThuoc], (err, result) => {
    if (err) {
       console.error("Lỗi khi sửa thuốc:", err);
       if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Lỗi: Tên thuốc này đã tồn tại!" });
       }
       if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ message: "Lỗi: Loại thuốc hoặc Nhà cung cấp không hợp lệ!" });
       }
       return res.status(500).json({ message: "Lỗi khi sửa thuốc!" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy thuốc cần sửa!" });
    }
    return res.status(200).json({ message: "Sửa thuốc thành công!", MaThuoc });
  });
});

// hiển thị thuốc
router.get("/list", (req, res) => {
 const sql = `
    SELECT 
  t.MaThuoc, t.TenThuoc, t.DonViTinh, t.SoLuongTon, 
  t.GiaNhap, t.GiaBan, t.MaLoai,
  t.MaNhaCungCap,
  n.TenNhaCungCap AS TenNhaCungCap,
  l.TenLoai AS TenLoai
FROM Thuoc t
JOIN NhaCungCap n ON t.MaNhaCungCap = n.MaNhaCungCap
JOIN LoaiThuoc l ON t.MaLoai = l.MaLoai
ORDER BY t.MaThuoc ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách thuốc:", err);
      return res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc!" });
    }
    return res.json(rows); // Trả về mảng rỗng nếu không có gì
  });
});
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      t.MaThuoc, 
      t.TenThuoc, 
      t.DonViTinh, 
      t.GiaBan, 
      t.HinhAnh, 
      lt.TenLoai,
      -- Tính tổng số lượng còn lại trong kho
      COALESCE(SUM(ctn.SoLuongConLai), 0) AS SoLuongTon
    FROM Thuoc t
    LEFT JOIN LoaiThuoc lt ON t.MaLoai = lt.MaLoai
    LEFT JOIN ChiTietNhap ctn ON t.MaThuoc = ctn.MaThuoc
    GROUP BY t.MaThuoc, t.TenThuoc, t.DonViTinh, t.GiaBan, t.HinhAnh, lt.TenLoai
  `;
  
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const imageFolderPath = path.join(__dirname, '../../public/images/thuoc');

if (!fs.existsSync(imageFolderPath)) {
    fs.mkdirSync(imageFolderPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageFolderPath);
    },
    filename: function (req, file, cb) {
        const maThuoc = req.params.id;
        
        cb(null, `${maThuoc}.jpg`); 
    }
});

const upload = multer({ storage: storage });

router.post('/:id/upload-image', (req, res) => {
    const maThuoc = req.params.id;

    
    fs.readdir(imageFolderPath, (err, files) => {
        if (!err) {
            files.forEach(file => {
                
                if (file.startsWith(`${maThuoc}.`) && file !== `${maThuoc}.jpg`) {
                    fs.unlinkSync(path.join(imageFolderPath, file));
                }
            });
        }
    });

    const uploadSingle = upload.single('image');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Lỗi upload Multer', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Lỗi không xác định', error: err });
        }


        return res.status(200).json({ 
            message: 'Upload ảnh thành công', 
            imagePath: `/images/thuoc/${maThuoc}.jpg` 
        });
    });
});
router.get('/danhmuc/:maLoai', (req, res) => {
    const maLoai = req.params.maLoai;

    const sql = `
        SELECT * FROM Thuoc 
        WHERE MaLoai = ?
    `;

    db.query(sql, [maLoai], (err, data) => {
        if (err) {
            console.error("Lỗi SQL:", err);
            return res.status(500).json({ message: "Lỗi server khi lấy thuốc theo danh mục" });
        }
        
        return res.status(200).json(data);
    });
});

router.get("/search", (req, res) => {
  const { keyword } = req.query; 

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập tên thuốc để tìm kiếm!" });
  }

  const sql = `
    SELECT 
      t.MaThuoc, t.TenThuoc, t.DonViTinh, t.SoLuongTon, 
      t.GiaNhap, t.GiaBan, 
      n.TenNhaCungCap AS TenNhaCungCap,
      l.TenLoai AS TenLoai
    FROM Thuoc t
    JOIN NhaCungCap n ON t.MaNhaCungCap = n.MaNhaCungCap
    JOIN LoaiThuoc l ON t.MaLoai = l.MaLoai
    WHERE t.TenThuoc LIKE ?
    ORDER BY t.MaThuoc ASC
  `;

  const searchTerm = `%${keyword}%`;

  db.query(sql, [searchTerm], (err, rows) => {
    if (err) {
      console.error("Lỗi tìm kiếm thuốc:", err);
      return res.status(500).json({ message: "Lỗi server khi tìm kiếm!" });
    }
    res.json(rows);
  });
});
// backend/routes/thuoc.js

// 1. API Lấy sản phẩm HOT (Logic: Tạm lấy 8 thuốc có số lượng tồn ít nhất - bán chạy)
router.get("/hot", (req, res) => {
    const sql = "SELECT * FROM Thuoc WHERE SoLuongTon > 0 ORDER BY SoLuongTon ASC LIMIT 12";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json(result);
    });
});

// 2. Lấy sản phẩm MỚI (Sắp xếp theo Mã giảm dần hoặc Ngày nhập)
router.get("/new", (req, res) => {
    // Giả sử mã thuốc tự tăng hoặc có ngày nhập, ở đây dùng MaThuoc giảm dần
    const sql = "SELECT * FROM Thuoc ORDER BY MaThuoc DESC LIMIT 12";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json(result);
    });
});

// 3. Lấy sản phẩm TẶNG KÈM (Giá bán = 0)
router.get("/free", (req, res) => {
    const sql = "SELECT * FROM Thuoc WHERE GiaBan = 0";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json(result);
    });
});
// ... (Giữ nguyên các API cũ bên dưới)
export default router;