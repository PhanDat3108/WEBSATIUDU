import React from 'react';
import styles from '../../styles/Modal.module.css';

// Định nghĩa các props mà Modal nhận vào
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Nội dung bên trong Modal (chính là cái Form)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Không render gì nếu isOpen=false

  return (
    // Lớp phủ
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Container của Modal, stopPropagation để click vào không bị tắt */}
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Header (Tiêu đề và nút X) */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
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