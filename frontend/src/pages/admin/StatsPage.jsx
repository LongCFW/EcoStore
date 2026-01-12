import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';

const StatsPage = () => {
  // Dữ liệu giả: Doanh thu & Lợi nhuận 12 tháng
  const dataRevenue = [
    { month: 'T1', revenue: 4000, profit: 2400 },
    { month: 'T2', revenue: 3000, profit: 1398 },
    { month: 'T3', revenue: 2000, profit: 9800 },
    { month: 'T4', revenue: 2780, profit: 3908 },
    { month: 'T5', revenue: 1890, profit: 4800 },
    { month: 'T6', revenue: 2390, profit: 3800 },
    { month: 'T7', revenue: 3490, profit: 4300 },
    { month: 'T8', revenue: 4000, profit: 2400 },
    { month: 'T9', revenue: 3000, profit: 1398 },
    { month: 'T10', revenue: 2000, profit: 9800 },
    { month: 'T11', revenue: 5780, profit: 3908 },
    { month: 'T12', revenue: 6890, profit: 4800 },
  ];

  // Dữ liệu giả: Top 5 sản phẩm bán chạy
  const dataTopProducts = [
    { name: 'Bàn chải tre', sales: 120 },
    { name: 'Bình giữ nhiệt', sales: 98 },
    { name: 'Túi vải', sales: 86 },
    { name: 'Xà phòng', sales: 55 },
    { name: 'Ống hút', sales: 40 },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Báo cáo thống kê</h2>
        <Form.Select style={{width: '200px'}}>
            <option>Năm nay (2025)</option>
            <option>Năm trước (2024)</option>
        </Form.Select>
      </div>

      <Row className="g-4 mb-4">
        {/* Biểu đồ Doanh thu & Lợi nhuận (Area Chart) */}
        <Col lg={8}>
            <Card className="border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4">Biểu đồ tăng trưởng tài chính</h5>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataRevenue}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#198754" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#198754" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0dcaf0" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0dcaf0" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#198754" fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#0dcaf0" fillOpacity={1} fill="url(#colorPro)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>

        {/* Biểu đồ Top sản phẩm (Bar Chart) */}
        <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4">Top 5 bán chạy</h5>
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={dataTopProducts}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="sales" name="Đã bán" fill="#ffc107" barSize={20} radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết KPI (Ví dụ) */}
      <Card className="border-0 shadow-sm">
         <Card.Header className="bg-white py-3 fw-bold">Chỉ số hiệu quả (KPIs)</Card.Header>
         <Card.Body>
            <Row className="text-center">
                <Col md={3} className="border-end">
                    <h6 className="text-muted">Tỷ lệ chuyển đổi</h6>
                    <h3 className="fw-bold text-success">3.2%</h3>
                    <small className="text-success">↑ 0.5% so với tháng trước</small>
                </Col>
                <Col md={3} className="border-end">
                    <h6 className="text-muted">Giá trị đơn trung bình</h6>
                    <h3 className="fw-bold text-primary">450k</h3>
                    <small className="text-danger">↓ 10k so với tháng trước</small>
                </Col>
                <Col md={3} className="border-end">
                    <h6 className="text-muted">Tỷ lệ quay lại</h6>
                    <h3 className="fw-bold text-warning">25%</h3>
                    <small className="text-success">↑ 2% so với tháng trước</small>
                </Col>
                <Col md={3}>
                    <h6 className="text-muted">Tổng chi phí QC</h6>
                    <h3 className="fw-bold text-danger">15tr</h3>
                    <small className="text-muted">Bằng tháng trước</small>
                </Col>
            </Row>
         </Card.Body>
      </Card>
    </div>
  );
};

export default StatsPage;