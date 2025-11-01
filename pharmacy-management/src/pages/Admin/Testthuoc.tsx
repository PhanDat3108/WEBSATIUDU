import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/thuoc";

interface Thuoc {
  MaThuoc?: string;
  TenThuoc: string;
  DonViTinh: string;
  SoLuongTon?: number;
  GiaNhap?: number;
  HanSuDung: string;
  NhaCungCap?: string;
  NgayNhap?: string;
  MaLoai: string;
  GiaBan: number;
}

const TestThuoc: React.FC = () => {
  const [dsThuoc, setDsThuoc] = useState<Thuoc[]>([]);
  const [thuoc, setThuoc] = useState<Thuoc>({
    TenThuoc: "",
    DonViTinh: "",
    SoLuongTon: 0,
    GiaNhap: 0,
    HanSuDung: "",
    NhaCungCap: "",
    NgayNhap: "",
    MaLoai: "",
    GiaBan: 0,
  });
  const [sua, setSua] = useState(false);

  const loadThuoc = async () => {
    const res = await axios.get<Thuoc[]>(`${API_URL}/list`);
    setDsThuoc(res.data);
  };

  useEffect(() => {
    loadThuoc();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ép kiểu cho các input số
    if (["SoLuongTon", "GiaNhap", "GiaBan"].includes(name)) {
      setThuoc({ ...thuoc, [name]: Number(value) });
    } else {
      setThuoc({ ...thuoc, [name]: value });
    }
  };

  const resetThuoc = () => {
    setThuoc({
      TenThuoc: "",
      DonViTinh: "",
      SoLuongTon: 0,
      GiaNhap: 0,
      HanSuDung: "",
      NhaCungCap: "",
      NgayNhap: "",
      MaLoai: "",
      GiaBan: 0,
    });
    setSua(false);
  };

  const handleAdd = async () => {
    if (!thuoc.TenThuoc || !thuoc.DonViTinh || !thuoc.HanSuDung || !thuoc.MaLoai || !thuoc.GiaBan) {
      alert("Vui lòng nhập đủ thông tin bắt buộc!");
      return;
    }

    const data = {
      ...thuoc,
      NgayNhap: thuoc.NgayNhap ? thuoc.NgayNhap : new Date().toISOString().slice(0, 10),
    };

    await axios.post(`${API_URL}/add`, data);
    resetThuoc();
    loadThuoc();
  };

  const handleDelete = async (maThuoc: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá thuốc này?")) return;
    await axios.delete(`${API_URL}/delete/${maThuoc}`);
    loadThuoc();
  };

  const handleEdit = (t: Thuoc) => {
    setSua(true);
    setThuoc(t);
  };const handleUpdate = async () => {
  if (!thuoc.MaThuoc) return alert("Thiếu mã thuốc để sửa!");

  // Chuyển ngày về định dạng MySQL hợp lệ
  const toDate = (d: any) => {
    if (!d) return null;
    return new Date(d).toISOString().slice(0, 10); // chỉ lấy yyyy-mm-dd
  };

  const data = {
    maThuoc: thuoc.MaThuoc,
    tenThuoc: thuoc.TenThuoc,
    donViTinh: thuoc.DonViTinh,
    soLuongTon: Number(thuoc.SoLuongTon) || 0,
    giaNhap: Number(thuoc.GiaNhap) || 0,
    hanSuDung: toDate(thuoc.HanSuDung),
    nhaCungCap: thuoc.NhaCungCap || null,
    ngayNhap: toDate(thuoc.NgayNhap) || new Date().toISOString().slice(0, 10),
    maLoai: thuoc.MaLoai || null,
    giaBan: Number(thuoc.GiaBan) || 0,
  };

  try {
    const res = await axios.put(`${API_URL}/fix`, data);
    alert((res.data as any).message);
    resetThuoc();
    loadThuoc();
  } catch (err: any) {
    console.error("Lỗi khi cập nhật thuốc:", err.response?.data || err.message);
    alert("Lỗi khi cập nhật thuốc!");
  }
};


  

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Quản lý thuốc</h2>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input name="TenThuoc" placeholder="Tên thuốc" value={thuoc.TenThuoc} onChange={handleChange} />
        <input name="DonViTinh" placeholder="Đơn vị tính" value={thuoc.DonViTinh} onChange={handleChange} />
        <input name="SoLuongTon" placeholder="Số lượng" value={thuoc.SoLuongTon} onChange={handleChange} />
        <input name="GiaNhap" placeholder="Giá nhập" value={thuoc.GiaNhap} onChange={handleChange} />
        <input name="HanSuDung" placeholder="Hạn sử dụng (YYYY-MM-DD)" value={thuoc.HanSuDung} onChange={handleChange} />
        <input name="NhaCungCap" placeholder="Nhà cung cấp" value={thuoc.NhaCungCap} onChange={handleChange} />
        <input name="NgayNhap" placeholder="Ngày nhập (YYYY-MM-DD)" value={thuoc.NgayNhap} onChange={handleChange} />
        <input name="MaLoai" placeholder="Mã loại" value={thuoc.MaLoai} onChange={handleChange} />
        <input name="GiaBan" placeholder="Giá bán" value={thuoc.GiaBan} onChange={handleChange} />
      </div>

      {sua ? (
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">
          Cập nhật thuốc
        </button>
      ) : (
        <button onClick={handleAdd} className="bg-green-500 text-white px-3 py-1 rounded">
          Thêm thuốc
        </button>
      )}

      <h3 className="text-lg font-semibold mt-5">Danh sách thuốc</h3>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th>Mã</th>
            <th>Tên thuốc</th>
            <th>Đơn vị</th>
            <th>Giá bán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {dsThuoc.map((t) => (
            <tr key={t.MaThuoc}>
              <td>{t.MaThuoc}</td>
              <td>{t.TenThuoc}</td>
              <td>{t.DonViTinh}</td>
              <td>{t.GiaBan}</td>
              <td>
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(t.MaThuoc!)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestThuoc;
