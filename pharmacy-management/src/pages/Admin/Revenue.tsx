import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, Empty, DatePicker } from "antd";
import { DollarCircleOutlined, ShoppingCartOutlined, RiseOutlined, FallOutlined, CalendarOutlined } from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from "recharts";
import dayjs, { Dayjs } from 'dayjs';
import { getRevenueStats } from "../../api/revenueApi";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const Revenue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // State lưu tháng đang chọn (Mặc định là tháng hiện tại)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  const fetchData = async (date: Dayjs) => {
    setLoading(true);
    try {
      // Lấy tháng và năm từ DatePicker (Lưu ý: dayjs().month() trả về 0-11 nên cần +1)
      const month = date.month() + 1;
      const year = date.year();
      
      console.log(`Đang tải dữ liệu tháng ${month}/${year}...`);
      const result = await getRevenueStats(month, year);
      setData(result);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lần đầu khi vào trang
  useEffect(() => {
    fetchData(selectedMonth);
  }, []);

  // Xử lý khi người dùng chọn tháng khác
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedMonth(date);
      fetchData(date);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      
      {/* HEADLINE & BỘ LỌC */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: "700", color: "#001529" }}>
          Báo cáo Doanh thu
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 500 }}>Chọn tháng:</span>
          <DatePicker 
            picker="month" 
            value={selectedMonth}
            onChange={handleDateChange}
            format="MM/YYYY"
            allowClear={false}
            size="large"
            style={{ width: 200 }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", height: "50vh", alignItems: "center" }}>
          <Spin size="large" tip="Đang tính toán số liệu..." />
        </div>
      ) : !data ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <>
          {/* 1. THỐNG KÊ TỔNG QUAN */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Doanh thu bán hàng"
                  value={data.summary.totalRevenue}
                  formatter={(val) => formatCurrency(Number(val))}
                  prefix={<DollarCircleOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Lợi nhuận ròng"
                  value={data.summary.profit}
                  formatter={(val) => formatCurrency(Number(val))}
                  prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: data.summary.profit >= 0 ? "#52c41a" : "#cf1322", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ borderRadius: 8 }}>
                <Statistic
                  title="Số lượng thuốc bán ra"
                  value={data.summary.totalSold}
                  prefix={<ShoppingCartOutlined style={{ color: "#faad14" }} />}
                  suffix="đơn vị"
                  valueStyle={{ color: "#faad14", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          {/* 2. BIỂU ĐỒ */}
          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col xs={24} lg={16}>
              <Card title={`Biểu đồ doanh thu tháng ${selectedMonth.format('MM/YYYY')}`} bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data.chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tickFormatter={(str) => dayjs(str).format('DD/MM')} />
                      <YAxis tickFormatter={(val) => new Intl.NumberFormat("en", { notation: "compact" }).format(val)} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip formatter={(val: any) => formatCurrency(val)} labelFormatter={(label) => `Ngày: ${dayjs(label).format('DD/MM/YYYY')}`} />
                      <Area type="monotone" dataKey="value" stroke="#1890ff" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Top 5 Thuốc bán chạy" bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.topProducts} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Đã bán" barSize={20} radius={[0, 4, 4, 0]}>
                        {data.topProducts?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Revenue;