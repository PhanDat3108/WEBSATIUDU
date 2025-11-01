// pharmacy-management/backend/server.js
import express from "express";
import db from "./config/db.js";
import thuocRoutes from "./routes/thuoc.js";
import authRoutes from "./routes/auth.js";
import cors from "cors"; // 1. THÊM DÒNG NÀY

const app = express();
const port = process.env.PORT || 8080;

// 2. THÊM DÒNG NÀY (Phải nằm trước các app.use routes)
app.use(cors()); 

app.use(express.json());

// 3. SỬA ĐƯỜNG DẪN NÀY
//    Chúng ta sẽ thống nhất dùng /api/v1/thuoc
app.use("/api/v1/thuoc", thuocRoutes); // Sửa từ "/api/thuoc"
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});