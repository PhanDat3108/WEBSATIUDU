import mysql from "mysql2";

const db = mysql.createConnection({
  host: "switchyard.proxy.rlwy.net",
  user: "root",
  password: "nomwTHHBpGjckwTQUQcXyXiFeDaKpkhA",
  database: "railway",
  port: 57342
});

db.connect((err) => {
  if (err) {
    console.error(" Lỗi kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL Railway thành công!");
  }
});

export default db;
