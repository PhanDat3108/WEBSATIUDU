import React, { useEffect, useState } from "react";
import styles from "../../styles/Revenue.module.css"; 
import { DollarCircleOutlined, ShoppingCartOutlined, RiseOutlined, CalendarOutlined, LoadingOutlined,InboxOutlined} from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from "recharts";
import dayjs from 'dayjs';
import { getRevenueStats } from "../../api/revenueApi";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const Revenue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedMonthStr, setSelectedMonthStr] = useState<string>(dayjs().format('YYYY-MM'));

  const fetchData = async (monthStr: string) => {
    setLoading(true);
    try {
      const dateObj = dayjs(monthStr, "YYYY-MM");
      const month = dateObj.month() + 1;
      const year = dateObj.year();
      
      console.log(`Fetching data for ${month}/${year}...`);
      const result = await getRevenueStats(month, year);
      setData(result);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonthStr);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setSelectedMonthStr(val);
      fetchData(val);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className={styles.container}>
      
      {/* 1. HEADER & BỘ LỌC */}
      <div className={styles.header}>
        <h2 className={styles.title}>Báo cáo Doanh thu</h2>
        
        <div className={styles.filterGroup}>
          <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          <span style={{ fontWeight: 500 }}>Tháng:</span>
          <input 
            type="month" 
            value={selectedMonthStr}
            onChange={handleDateChange}
            className={styles.dateInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingOutlined style={{ fontSize: 40, color: "#1890ff" }} spin />
          <span className={styles.loadingText}>Đang tính toán số liệu...</span>
        </div>
      ) : !data ? (
        <div className={styles.emptyContainer}>
          <InboxOutlined style={{ fontSize: 60, color: "#d9d9d9", marginBottom: 10 }} />
          <div>Không có dữ liệu cho tháng này</div>
        </div>
      ) : (
        <>
          {/* 2. THỐNG KÊ TỔNG QUAN */}
          <div className={styles.statsGrid}>
            
            {/* Card 1: Doanh thu */}
            <div className={styles.card}>
              <div className={styles.statContent}>
                <div>
                  <div className={styles.statLabel}>Doanh thu bán hàng</div>
                  <div className={styles.statValue} style={{ color: "#1890ff" }}>
                    {formatCurrency(data.summary.totalRevenue)}
                  </div>
                </div>
                <div className={styles.iconBox} style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}>
                  <DollarCircleOutlined />
                </div>
              </div>
            </div>

            {/* Card 2: Lợi nhuận */}
            <div className={styles.card}>
              <div className={styles.statContent}>
                <div>
                  <div className={styles.statLabel}>Lợi nhuận ròng</div>
                  <div 
                    className={styles.statValue} 
                    style={{ color: data.summary.profit >= 0 ? "#52c41a" : "#cf1322" }}
                  >
                    {formatCurrency(data.summary.profit)}
                  </div>
                </div>
                <div className={styles.iconBox} style={{ backgroundColor: "#f6ffed", color: "#52c41a" }}>
                  <RiseOutlined />
                </div>
              </div>
            </div>

            {/* Card 3: Số lượng bán */}
            <div className={styles.card}>
              <div className={styles.statContent}>
                <div>
                  <div className={styles.statLabel}>Số lượng thuốc bán ra</div>
                  <div className={styles.statValue} style={{ color: "#faad14" }}>
                    {data.summary.totalSold} 
                    <span style={{ fontSize: 14, fontWeight: 'normal', color: '#8c8c8c', marginLeft: 4 }}>đơn vị</span>
                  </div>
                </div>
                <div className={styles.iconBox} style={{ backgroundColor: "#fff7e6", color: "#faad14" }}>
                  <ShoppingCartOutlined />
                </div>
              </div>
            </div>
          </div>

          {/* 3. BIỂU ĐỒ */}
          <div className={styles.chartSection}>
            
            {/* Biểu đồ vùng (Area Chart) - Chiếm 2 phần (flex: 2) */}
            <div className={styles.chartCard} style={{ flex: "2 1 600px" }}>
              <div className={styles.chartTitle}>
                Biểu đồ doanh thu tháng {dayjs(selectedMonthStr).format('MM/YYYY')}
              </div>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(str) => dayjs(str).format('DD/MM')} 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      tickFormatter={(val) => new Intl.NumberFormat("en", { notation: "compact" }).format(val)} 
                      style={{ fontSize: '12px' }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <Tooltip 
                      formatter={(val: any) => formatCurrency(val)} 
                      labelFormatter={(label) => `Ngày: ${dayjs(label).format('DD/MM/YYYY')}`}
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1890ff" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="Doanh thu" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ cột (Bar Chart) - Top Products - Chiếm 1 phần (flex: 1) */}
            <div className={styles.chartCard} style={{ flex: "1 1 350px" }}>
              <div className={styles.chartTitle}>Top 5 Thuốc bán chạy</div>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={data.topProducts} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100} 
                      style={{ fontSize: '12px', fontWeight: 500 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                    />
                    <Bar dataKey="value" name="Đã bán" barSize={20} radius={[0, 4, 4, 0]}>
                      {data.topProducts?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Revenue;