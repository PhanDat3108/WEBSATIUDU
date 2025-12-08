import React, { useEffect, useState } from "react";
// 1. Giữ lại Ant Design Icons
import { 
  DollarCircleOutlined, 
  ShoppingCartOutlined, 
  RiseOutlined, 
  CalendarOutlined, 
  LoadingOutlined,
  InboxOutlined
} from "@ant-design/icons";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, Cell 
} from "recharts";

import dayjs from 'dayjs';
import { getRevenueStats } from "../../api/revenueApi";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const Revenue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // State lưu chuỗi tháng định dạng "YYYY-MM" dùng cho input type="month"
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

  // ================= STYLES (CSS-in-JS cơ bản) =================
  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      margin: 0,
      fontWeight: "700",
      color: "#001529",
      fontSize: "24px",
    },
    filterGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    dateInput: {
      border: "1px solid #d9d9d9",
      padding: "6px 12px",
      borderRadius: "4px",
      outline: "none",
      fontSize: "14px",
      color: "#595959",
    },
    // Grid cho 3 ô thống kê
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    // Style chung cho Card
    card: {
      backgroundColor: "#fff",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
    },
    // Style nội dung trong ô thống kê
    statContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statLabel: {
      fontSize: "14px",
      color: "rgba(0, 0, 0, 0.45)",
      marginBottom: "4px",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.85)",
    },
    iconBox: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
    },
    // Layout cho phần biểu đồ
    chartSection: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "24px",
    },
    chartCard: {
      backgroundColor: "#fff",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      flex: "1 1 500px", // Flex grow, shrink, basis
    },
    chartTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "rgba(0, 0, 0, 0.85)",
      marginBottom: "24px",
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: "12px",
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. HEADER & BỘ LỌC */}
      <div style={styles.header}>
        <h2 style={styles.title}>Báo cáo Doanh thu</h2>
        
        <div style={styles.filterGroup}>
          <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          <span style={{ fontWeight: 500 }}>Tháng:</span>
          {/* Input native thay cho antd DatePicker */}
          <input 
            type="month" 
            value={selectedMonthStr}
            onChange={handleDateChange}
            style={styles.dateInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column", gap: 10 }}>
          <LoadingOutlined style={{ fontSize: 40, color: "#1890ff" }} spin />
          <span style={{ color: "#595959" }}>Đang tính toán số liệu...</span>
        </div>
      ) : !data ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          <InboxOutlined style={{ fontSize: 60, color: "#d9d9d9", marginBottom: 10 }} />
          <div>Không có dữ liệu cho tháng này</div>
        </div>
      ) : (
        <>
          {/* 2. THỐNG KÊ TỔNG QUAN (Custom Cards dùng Icon Antd) */}
          <div style={styles.statsGrid}>
            
            {/* Card 1: Doanh thu */}
            <div style={styles.card}>
              <div style={styles.statContent}>
                <div>
                  <div style={styles.statLabel}>Doanh thu bán hàng</div>
                  <div style={{ ...styles.statValue, color: "#1890ff" }}>
                    {formatCurrency(data.summary.totalRevenue)}
                  </div>
                </div>
                {/* Icon Background */}
                <div style={{ ...styles.iconBox, backgroundColor: "#e6f7ff", color: "#1890ff" }}>
                  <DollarCircleOutlined />
                </div>
              </div>
            </div>

            {/* Card 2: Lợi nhuận */}
            <div style={styles.card}>
              <div style={styles.statContent}>
                <div>
                  <div style={styles.statLabel}>Lợi nhuận ròng</div>
                  <div style={{ ...styles.statValue, color: data.summary.profit >= 0 ? "#52c41a" : "#cf1322" }}>
                    {formatCurrency(data.summary.profit)}
                  </div>
                </div>
                <div style={{ ...styles.iconBox, backgroundColor: "#f6ffed", color: "#52c41a" }}>
                  <RiseOutlined />
                </div>
              </div>
            </div>

            {/* Card 3: Số lượng bán */}
            <div style={styles.card}>
              <div style={styles.statContent}>
                <div>
                  <div style={styles.statLabel}>Số lượng thuốc bán ra</div>
                  <div style={{ ...styles.statValue, color: "#faad14" }}>
                    {data.summary.totalSold} <span style={{ fontSize: 14, fontWeight: 'normal', color: '#8c8c8c' }}>đơn vị</span>
                  </div>
                </div>
                <div style={{ ...styles.iconBox, backgroundColor: "#fff7e6", color: "#faad14" }}>
                  <ShoppingCartOutlined />
                </div>
              </div>
            </div>
          </div>

          {/* 3. BIỂU ĐỒ */}
          <div style={styles.chartSection}>
            
            {/* Biểu đồ vùng (Area Chart) */}
            <div style={{ ...styles.chartCard, flex: "2 1 600px" }}>
              <div style={styles.chartTitle}>
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

            {/* Biểu đồ cột (Bar Chart) - Top Products */}
            <div style={{ ...styles.chartCard, flex: "1 1 350px" }}>
              <div style={styles.chartTitle}>Top 5 Thuốc bán chạy</div>
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