const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'quanlytuthuoc',
  password: 'Sati@1234',
  database: 'pharmacy_management'
});

db.connect(err => {
  if (err) console.log('Lỗi kết nối MySQL:', err);
  else console.log(' Kết nối MySQL thành công!');
});

app.get('/', (req, res) => {
  res.send('API đang hoạt động');
});

app.listen(8080, () => {
  console.log(' Server chạy tại http://localhost:8080');
});
