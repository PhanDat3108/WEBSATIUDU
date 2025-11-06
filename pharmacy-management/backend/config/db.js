import mysql from "mysql2";

const db = mysql.createConnection({
  host: "yamanote.proxy.rlwy.net",
  user: "root",
  password: "LZLhFTpImKdvCAKoUJzHCasNlvYDaOly",
  database: "railway",
  port: 15542
});

db.connect((err) => {
  if (err) {
    console.error(" Lỗi kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL Railway thành công!");
  }
});

export default db;
