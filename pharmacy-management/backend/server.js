import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "shuttle.proxy.rlwy.net",
  user: "root",
  password: "cvBYSZNGDpRTMphQxZgNDMmwEnZpBYVl",
  database: "railway",
  port: 20337
});

db.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
  } else {
    console.log("✅ Kết nối MySQL Railway thành công!");
  }
});


app.get("/", (req, res) => {
  res.send("API đang hoạt động với MySQL Railway!");
});


app.listen(8080, () => {
  console.log("🚀 Server chạy tại http://localhost:8080");
});
