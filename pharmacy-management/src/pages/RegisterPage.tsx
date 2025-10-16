// src/pages/RegisterPage.tsx
import React, { useState } from 'react';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn trình duyệt reload lại trang
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    
    // Tại đây, bạn sẽ gọi API để đăng ký người dùng
    console.log("Đang gửi dữ liệu đăng ký:", { email, password });
    
    // Ví dụ gọi API với axios (bạn cần cài đặt axios nếu chưa có)
    /*
    axios.post('http://localhost:8080/register', { email, password })
      .then(response => {
        console.log('Đăng ký thành công!', response.data);
      })
      .catch(error => {
        console.error('Lỗi đăng ký!', error);
      });
    */
  };

  return (
    <div>
      <h1>Trang Đăng Ký</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
  );
}

export default RegisterPage;