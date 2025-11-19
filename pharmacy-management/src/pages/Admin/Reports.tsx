import React, { useState, useEffect } from 'react';
import { getBaoCaoTonKho, getExpiryChartData } from '../../api/reportApi';
import { BaoCaoTonKho } from '../../interfaces';
import styles from '../../styles/AdminManagement.module.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ThuocReport {
  MaThuoc: string;
  TenThuoc: string;
  SoLuongTon: number;
  DonViTinh: string;
  HanSuDung?: string; 
}

const Reports: React.FC = () => {
  const [report, setReport] = useState<BaoCaoTonKho | null>(null);
  const [chartData, setChartData] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042']; 

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [reportData, expiryData] = await Promise.all([
            getBaoCaoTonKho(),
            getExpiryChartData()
        ]);

        setReport(reportData);

       
        const formattedChartData = [
            { name: 'Bình thường', value: expiryData.BinhThuong },
            { name: 'Sắp hết hạn', value: expiryData.SapHetHan },
            { name: 'Đã hết hạn (Cần hủy)', value: expiryData.DaHetHan },
        ];
        
        
        setChartData(formattedChartData.filter(item => item.value > 0));

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('vi-VN');
  };

  const renderThuocTable = (title: string, data: any[], showExpiry: boolean = false) => (
    <div className={styles.reportSection} style={{marginTop: '20px'}}>
      <h2 style={{fontSize: '1.2rem', color: '#333', marginBottom: '10px', borderLeft: '5px solid #1890ff', paddingLeft: '10px'}}>
        {title} <span style={{fontWeight: 'normal', color: '#666'}}>({data ? data.length : 0})</span>
      </h2>
      {data && data.length > 0 ? (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Mã Thuốc</th>
                <th>Tên Thuốc</th>
                <th>Số lượng tồn (Lô)</th>
                <th>Đơn vị</th>
                {showExpiry && <th>Hạn Sử Dụng</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((thuoc, idx) => (
                <tr key={`${thuoc.MaThuoc}-${idx}`}>
                    <td>{thuoc.MaThuoc}</td>
                    <td>{thuoc.TenThuoc}</td>
                    <td style={{fontWeight: 'bold', color: showExpiry && title.includes('đã hết hạn') ? 'red' : 'inherit'}}>
                        {thuoc.SoLuongTon}
                    </td>
                    <td>{thuoc.DonViTinh}</td>
                    {showExpiry && (
                        <td style={{color: title.includes('đã hết hạn') ? 'red' : '#faad14', fontWeight: '500'}}>
                            {formatDate(thuoc.HanSuDung)}
                        </td>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      ) : (
        <p style={{fontStyle: 'italic', color: '#888'}}>Không có thuốc nào trong danh mục này.</p>
      )}
    </div>
  );

  if (isLoading) return <div className={styles.container}><p>Đang tải báo cáo...</p></div>;
  if (error) return <div className={styles.container}><p style={{ color: 'red' }}>Lỗi: {error}</p></div>;
  if (!report) return <div className={styles.container}><p>Không có dữ liệu.</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Báo cáo Tồn kho & Hạn dùng</h1>
      
    
      <div className={styles.summaryGrid} style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
        <div className={styles.summaryCard} style={{flex: 1, padding: '20px', background: '#e6f7ff', borderRadius: '8px'}}>
          <h3>Tổng số loại thuốc</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#1890ff', margin: '10px 0'}}>{report.TongSoLoaiThuoc}</p>
        </div>
        <div className={styles.summaryCard} style={{flex: 1, padding: '20px', background: '#f6ffed', borderRadius: '8px'}}>
          <h3>Tổng lượng tồn kho</h3>
          <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#52c41a', margin: '10px 0'}}>{report.TongSoLuongTon}</p>
        </div>
      </div>

    
      <div className={styles.chartSection} style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: '350px'
      }}>
          <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Tỷ lệ tình trạng hạn sử dụng (Theo số lượng tồn)</h2>
          
          {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }: any) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [value, "Số lượng tồn"]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          ) : (
            <div style={{textAlign: 'center', color: '#999', padding: '50px'}}>
                Chưa có dữ liệu tồn kho hoặc tất cả thuốc đã hết hàng.
            </div>
          )}
      </div>
      
      {renderThuocTable('Thuốc đã hết hạn (Cần tiêu hủy)', report.ThuocDaHetHan, true)}
      {renderThuocTable('Thuốc sắp hết hạn (Trong 30 ngày)', report.ThuocSapHetHan, true)}
      {renderThuocTable('Thuốc sắp hết hàng (Tồn <= 10)', report.ThuocSapHetHang, false)}
      
    </div>
  );
};

export default Reports;