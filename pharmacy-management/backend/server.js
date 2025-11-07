// pharmacy-management/backend/server.js
import express from "express";
import db from "./config/db.js";
import thuocRoutes from "./routes/thuoc.js";
import authRoutes from "./routes/auth.js";
import benhNhanRoutes from "./routes/benhnhan.js"
import cors from "cors"; 
import nhanVienRouter from "./routes/nhanvien.js";
import loaiThuocRouter from "./routes/loaithuoc.js";
import nhaCungCapRouter from "./routes/nhacungcap.js";



const app = express();
const port = process.env.PORT || 8080;


app.use(cors()); 

app.use(express.json());

//    Chúng ta sẽ thống nhất dùng /api/v1/thuoc
app.use("/api/v1/nhanvien", nhanVienRouter);
app.use("/api/v1/thuoc", thuocRoutes); 
app.use("/api/v1/benhnhan", benhNhanRoutes);
app.use("/api/v1/loaithuoc", loaiThuocRouter);
app.use("/api/v1/nhacungcap", nhaCungCapRouter);

app.use("/api/auth", authRoutes);



app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});