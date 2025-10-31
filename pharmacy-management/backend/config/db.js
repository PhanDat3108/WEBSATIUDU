import mysql from "mysql2";

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

export default db;
