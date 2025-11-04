import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // [MỚI] State nội bộ để quản lý việc hiển thị (dùng cho animation)
  const [isVisible, setIsVisible] = useState(false);
  // [MỚI] State quản lý class animation
  const [animationClass, setAnimationClass] = useState('');

  // [CẬP NHẬT] Dùng useEffect để xử lý animation
  useEffect(() => {
    if (isOpen) {
      // 1. Khi Mở: Bật cờ visible, sau đó thêm class "vào"
      setIsVisible(true);
      setAnimationClass('animate__bounceInDown');
    } else if (isVisible) {
      // 2. Khi Đóng (và đang được hiển thị):
      setAnimationClass('animate__bounceOut'); // Chạy class "ra"
      
      // Đợi hiệu ứng 'bounceOut' (750ms) chạy xong rồi mới ẩn
      setTimeout(() => {
        setIsVisible(false);
      }, 750); 
    }
  }, [isOpen, isVisible]); // Theo dõi 2 state này

  // [MỚI] Hàm xử lý khi bấm nút X hoặc click overlay
  const handleClose = () => {
    // Chỉ gọi hàm onClose của cha,
    // useEffect ở trên sẽ tự động xử lý animation
    onClose();
  };

  // [CẬP NHẬT] Nếu không visible, không render gì cả
  if (!isVisible) return null; 

  return (
    // [CẬP NHẬT] Lớp phủ (onClick gọi handleClose)
    <div className={styles.modalOverlay} onClick={handleClose}>
      
      {/* [CẬP NHẬT] Thêm các class animation
      */}
      <div 
        className={`${styles.modalContainer} animate__animated ${animationClass} animate__faster`} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (onClick gọi handleClose) */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={handleClose}>&times;</button>
        </div>

        {/* Body (Chứa Form) */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;