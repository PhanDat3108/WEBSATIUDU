import React from "react";
import { Link } from "react-router-dom";
import "../styles/home/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-subscribe">
          <input type="email" placeholder="Nhập email nhận tin khuyến mãi" />
          <button>ĐĂNG KÝ</button>
        </div>
        <div className="footer-social">
          <span>Kết nối với chúng tôi:</span>
          <div className="social-icons">
            <img src="https://tse2.mm.bing.net/th/id/OIP.q1kFk5fqe5hGx3rH_iD_9QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Zalo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" />
            <img src="https://freepnglogo.com/images/all_img/1701522088youtube-square-logo-png-hd.png " alt="YouTube" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          </div>
        </div>
      </div>

      
      <div className="footer-content">
        <div className="footer-column">
          <h3 className="logo"><span className="z"></span>SATIUDU</h3>
          <p>
            Cửa hàng thực phẩm chức năng Dola Pharmacy là địa chỉ tin cậy để bạn
            tìm kiếm những sản phẩm chất lượng nhất.
          </p>
          <ul className="contact-info">
            <li>📍 Thành phố Hà Nội</li>
            <li>📞 0354488686</li>
            <li>✉️ Pharmacy36@gmail.com</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>CHÍNH SÁCH</h4>
          <ul>
            <li>• Chính sách thành viên</li>
            <li>• Chính sách thanh toán</li>
            <li>• Hướng dẫn mua hàng</li>
            <li>• Bảo mật thông tin cá nhân</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>HƯỚNG DẪN</h4>
          <ul>
            <li>• Hướng dẫn mua hàng</li>
            <li>• Hướng dẫn thanh toán</li>
            <li>• Đăng ký thành viên</li>
            <li>• Hỗ trợ khách hàng</li>
            <li>• Câu hỏi thường gặp</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>DANH MỤC</h4>
          <ul>
            <li>• Về Mew Yummy</li>
            <li>• Tuyển dụng nhân sự</li>
            <li>• Giá trị cốt lõi</li>
            <li>• Nguồn gốc thực phẩm</li>
            <li>• Liên hệ</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>ĐĂNG KÝ NHẬN TIN</h4>
          <p><strong>MUA ONLINE (08:30 - 20:30)</strong></p>
          <p className="hotline">📞 0354488686</p>
          <p>• Tất cả các ngày trong tuần</p>

          <p><strong>GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</strong></p>
          <p className="hotline">📞 0354488686</p>
          <p>• Tất cả các ngày trong tuần</p>

          <h4>LIÊN KẾT SÀN</h4>
          <div className="market-icons">
            <img src="https://th.bing.com/th/id/R.6287255214805d04b927ee0c53c88f64?rik=Hajf3OR9ipXMdQ&riu=http%3a%2f%2ffreelogopng.com%2fimages%2fall_img%2f1656180674shopee-logo-transparent.png&ehk=9Uim1JMb9bW6YMwQi6SDKsI56jFiz6E4jvDwKPNcx8M%3d&risl=&pid=ImgRaw&r=0" alt="Shopee" />
            <img src="https://play-lh.googleusercontent.com/0dnEgxAzgVpZ7N4x4nLKVCxDMYvZUDWG3p4h_Jtk4il_oommGP5hDLI7SBOdkzIqXw" alt="Lazada" />
            <img src="https://tse3.mm.bing.net/th/id/OIP.u4i_kcytvodFvk1fr8_otwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Tiki" />
            <img src="https://th.bing.com/th/id/R.19112757be91219d5f50c2790352bd4d?rik=yfIsC%2f%2f0Hr68Rg&pid=ImgRaw&r=0" alt="Sendo" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
