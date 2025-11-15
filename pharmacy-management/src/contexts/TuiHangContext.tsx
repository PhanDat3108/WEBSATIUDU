import React, { createContext, useContext, useState } from 'react';
import { Thuoc } from '../interfaces';

export interface SanPhamTuiHang extends Thuoc {
  soLuong: number;
}

interface TuiHangContextType {
  danhSachSanPham: SanPhamTuiHang[];
  themVaoTuiHang: (sanPham: Thuoc, soLuong?: number) => void;
  xoaKhoiTuiHang: (maThuoc: string) => void;
  capNhatSoLuong: (maThuoc: string, soLuong: number) => void;
  xoaTuiHang: () => void;
  layTongTien: () => number;
  layTongSoLuong: () => number;
  // state để điều khiển sidebar đơn thuốc
  moRong: boolean;
  setMoRong: (v: boolean) => void;
}

const TuiHangContext = createContext<TuiHangContextType | undefined>(undefined);

export const NhaPungCungCapTuiHang: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPhamTuiHang[]>([]);
  const [moRong, setMoRong] = useState<boolean>(false);

  const themVaoTuiHang = (sanPham: Thuoc, soLuong: number = 1) => {
    setDanhSachSanPham((prev) => {
      const coSanPhamRoi = prev.find((item) => item.MaThuoc === sanPham.MaThuoc);
      if (coSanPhamRoi) {
        return prev.map((item) =>
          item.MaThuoc === sanPham.MaThuoc
            ? { ...item, soLuong: item.soLuong + soLuong }
            : item
        );
      }
      return [...prev, { ...sanPham, soLuong }];
    });
  };

  const xoaKhoiTuiHang = (maThuoc: string) => {
    setDanhSachSanPham((prev) => prev.filter((item) => item.MaThuoc !== maThuoc));
  };

  const capNhatSoLuong = (maThuoc: string, soLuong: number) => {
    if (soLuong <= 0) {
      xoaKhoiTuiHang(maThuoc);
      return;
    }
    setDanhSachSanPham((prev) =>
      prev.map((item) =>
        item.MaThuoc === maThuoc ? { ...item, soLuong } : item
      )
    );
  };

  const xoaTuiHang = () => {
    setDanhSachSanPham([]);
  };

  const layTongTien = () => {
    return danhSachSanPham.reduce((sum, item) => sum + item.GiaBan * item.soLuong, 0);
  };

  const layTongSoLuong = () => {
    return danhSachSanPham.reduce((sum, item) => sum + item.soLuong, 0);
  };

  return (
    <TuiHangContext.Provider
      value={{
        danhSachSanPham,
        themVaoTuiHang,
        xoaKhoiTuiHang,
        capNhatSoLuong,
        xoaTuiHang,
        layTongTien,
        layTongSoLuong,
        moRong,
        setMoRong,
      }}
    >
      {children}
    </TuiHangContext.Provider>
  );
};

export const useTuiHang = () => {
  const context = useContext(TuiHangContext);
  if (context === undefined) {
    throw new Error('useTuiHang phải được sử dụng bên trong NhaPungCungCapTuiHang');
  }
  return context;
};
