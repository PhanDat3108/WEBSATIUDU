import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL Railway
const db = mysql.createConnection({
  host: "shuttle.proxy.rlwy.net",
  user: "root",
  password: "cvBYSZNGDpRTMphQxZgNDMmwEnZpBYVl",
  database: "railway",
  port: 20337
});

// Kiểm tra kết nối
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

app.get("/benhnhan", (req, res) => {
  const sql = "SELECT * FROM BenhNhan";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Lỗi truy vấn MySQL");
    } else {
      res.json(results);
    }
  });
});

app.listen(8080, () => {
  console.log("🚀 Server chạy tại http://localhost:8080");
});
