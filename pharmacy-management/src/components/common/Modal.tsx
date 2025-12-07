import React, { useState, useEffect } from "react";
import styles from "../../styles/Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  customClass?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = "400px", customClass = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  // Dùng useEffect để xử lý animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationClass("animate__bounceInDown");
    } else if (isVisible) {
      setAnimationClass("animate__bounceOut"); 
      // Đợi hiệu ứng 'bounceOut' (750ms) chạy xong rồi mới ẩn
      setTimeout(() => {
        setIsVisible(false);
      }, 750);
    }
  }, [isOpen, isVisible]); 

  //  Hàm xử lý khi bấm nút X hoặc click overlay
  const handleClose = () => {
    onClose();
  };
// nếu ko mở thì chưa render
  if (!isVisible) return null;

  return (
    
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${customClass} animate__animated ${animationClass} animate__faster`}
        onClick={(e) => e.stopPropagation()}
        style={{ width }}
      >
        {/* Header (onClick gọi handleClose) */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>

        {/* Body (Chứa Form) */}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
