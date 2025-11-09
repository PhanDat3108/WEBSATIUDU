// src/components/common/ModalWithAnimation.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.css';
// Đảm bảo bạn đã import 'animate.css' ở tệp index.tsx hoặc App.tsx
// import 'animate.css'; 

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  customClass?: string;
  isOpen: boolean; // Bắt buộc phải có prop này
}

const ModalWithAnimation: React.FC<ModalProps> = ({ title, onClose, children, customClass, isOpen }) => {
  // State nội bộ để quản lý việc *có* render hay không (để chạy animation)
  const [isVisible, setIsVisible] = useState(false);
  // State quản lý class animation (vào/ra)
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      // 1. Mở: Hiện component và chạy animation 'vào'
      setIsVisible(true);
      setAnimationClass('animate__bounceInDown');
    } else if (isVisible) {
      // 2. Đóng (khi đang hiện): Chạy animation 'ra'
      setAnimationClass('animate__bounceOut');
      
      // Đợi animation chạy xong (750ms) rồi mới ẩn component
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 750); 

      // Cleanup timer nếu component bị hủy (unmount)
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]); // Theo dõi 2 state này

  // Hàm xử lý khi bấm nút X hoặc click overlay
  const handleClose = () => {
    onClose(); // Báo cho component cha, cha sẽ cập nhật 'isOpen' thành false
  };

  // Nếu không visible, không render gì cả
  if (!isVisible) return null; 

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      
      {/* Áp dụng 'customClass' vào container */}
      <div 
        className={`${styles.modalContainer} ${customClass || ''} animate__animated ${animationClass} animate__faster`} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
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

export default ModalWithAnimation;