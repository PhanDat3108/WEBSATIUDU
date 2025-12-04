import React, { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import DanhSachSanPham from "../../components/HomeFroms/DanhSachSanPham"; 

const HomePage: React.FC = () => {
  // State 1: Lưu Category ID và Tên (nếu chọn danh mục)
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string}>({id: "", name: ""});
  
  // State 2: Lưu từ khóa tìm kiếm (nếu tìm theo tên thuốc)
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Logic: Khi chọn danh mục -> Xóa từ khóa tìm kiếm
  const handleSelectCategory = (id: string, name: string) => {
    setSelectedCategory({ id, name });
    setSearchKeyword(""); // Reset tìm kiếm
  };

  // Logic: Khi tìm kiếm -> Xóa danh mục đang chọn
  const handleSearchKeyword = (keyword: string) => {
    setSearchKeyword(keyword);
    setSelectedCategory({ id: "", name: "" }); // Reset danh mục
  };

  return (
    <>
      <Navbar 
        onSelectCategory={handleSelectCategory} 
        onSearchKeyword={handleSearchKeyword}
      /> 
      
      <main>
        {/* Truyền cả 2 loại dữ liệu xuống */}
        <DanhSachSanPham 
          maLoai={selectedCategory.id} 
          tenLoai={selectedCategory.name}
          searchKeyword={searchKeyword}
        />
      </main>
      
      <Footer />
    </>
  );
};

export default HomePage;