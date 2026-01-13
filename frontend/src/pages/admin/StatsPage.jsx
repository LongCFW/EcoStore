import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaDownload, FaCalendarAlt, FaChartPie, FaChartArea, FaWallet, FaShoppingCart } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useAdminTheme } from '../../context/useAdminTheme';
import '../../assets/styles/admin.css';

const StatsPage = () => {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Mock Data
  const monthlyData = [
    { name: 'Th 1', income: 4000, expense: 2400 },
    { name: 'Th 2', income: 3000, expense: 1398 },
    { name: 'Th 3', income: 2000, expense: 9800 },
    { name: 'Th 4', income: 2780, expense: 3908 },
    { name: 'Th 5', income: 1890, expense: 4800 },
    { name: 'Th 6', income: 2390, expense: 3800 },
    { name: 'Th 7', income: 3490, expense: 4300 },
  ];

  const productPerformance = [
    { name: 'Rau củ', sales: 4000, returns: 240 },
    { name: 'Trái cây', sales: 3000, returns: 139 },
    { name: 'Đồ khô', sales: 2000, returns: 980 },
    { name: 'Mỹ phẩm', sales: 2780, returns: 390 },
    { name: 'Gia dụng', sales: 1890, returns: 480 },
  ];

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Báo Cáo Thống Kê</h2>
            <p className="text-muted small m-0">Phân tích hiệu quả kinh doanh toàn hệ thống</p>
        </div>
        <div className="d-flex gap-2">
            <Form.Select className="shadow-none admin-input" style={{width: '150px'}}>
                <option>Tháng này</option>
                <option>Quý này</option>
                <option>Năm nay</option>
            </Form.Select>
            <Button variant="outline-success" className="rounded-pill px-3 fw-bold d-flex align-items-center gap-2">
                <FaDownload /> Xuất PDF
            </Button>
        </div>
      </div>

      {/* KPI CARDS (Dạng thẻ to) */}
      <Row className="g-4 mb-4">
          <Col md={6} xl={3}>
              <div className="stat-card border-bottom border-4 border-primary">
                  <div className="d-flex justify-content-between">
                      <div>
                          <p className="text-muted text-uppercase fw-bold small mb-1">Doanh thu thuần</p>
                          <h3 className="fw-bold text-primary">1.2 Tỷ</h3>
                      </div>
                      <div className="stat-icon bg-primary bg-opacity-10 text-primary"><FaWallet/></div>
                  </div>
                  <small className="text-success fw-bold">+12% <span className="text-muted fw-normal">so với kỳ trước</span></small>
              </div>
          </Col>
          <Col md={6} xl={3}>
              <div className="stat-card border-bottom border-4 border-success">
                  <div className="d-flex justify-content-between">
                      <div>
                          <p className="text-muted text-uppercase fw-bold small mb-1">Lợi nhuận gộp</p>
                          <h3 className="fw-bold text-success">450 Tr</h3>
                      </div>
                      <div className="stat-icon bg-success bg-opacity-10 text-success"><FaChartArea/></div>
                  </div>
                  <small className="text-success fw-bold">+5.5% <span className="text-muted fw-normal">so với kỳ trước</span></small>
              </div>
          </Col>
          <Col md={6} xl={3}>
              <div className="stat-card border-bottom border-4 border-warning">
                  <div className="d-flex justify-content-between">
                      <div>
                          <p className="text-muted text-uppercase fw-bold small mb-1">Chi phí vận hành</p>
                          <h3 className="fw-bold text-warning">120 Tr</h3>
                      </div>
                      <div className="stat-icon bg-warning bg-opacity-10 text-warning"><FaChartPie/></div>
                  </div>
                  <small className="text-danger fw-bold">+2% <span className="text-muted fw-normal">cao hơn dự kiến</span></small>
              </div>
          </Col>
          <Col md={6} xl={3}>
              <div className="stat-card border-bottom border-4 border-info">
                  <div className="d-flex justify-content-between">
                      <div>
                          <p className="text-muted text-uppercase fw-bold small mb-1">Tổng đơn hàng</p>
                          <h3 className="fw-bold text-info">3,450</h3>
                      </div>
                      <div className="stat-icon bg-info bg-opacity-10 text-info"><FaShoppingCart/></div>
                  </div>
                  <small className="text-success fw-bold">+150 <span className="text-muted fw-normal">đơn mới hôm nay</span></small>
              </div>
          </Col>
      </Row>

      {/* CHARTS */}
      <Row className="g-4">
          <Col lg={7}>
              <div className="chart-container">
                  <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Biểu Đồ Thu Chi</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f44336" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e1e1e' : '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}/>
                            <Legend verticalAlign="top" height={36}/>
                            <Area type="monotone" dataKey="income" name="Doanh thu" stroke="#4caf50" fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="expense" name="Chi phí" stroke="#f44336" fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>
          </Col>
          <Col lg={5}>
              <div className="chart-container">
                  <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Hiệu Quả Ngành Hàng</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={productPerformance} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#333' : '#eee'} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: isDark ? '#1e1e1e' : '#fff', borderRadius: '10px', border: 'none' }}/>
                            <Legend verticalAlign="top" height={36}/>
                            <Bar dataKey="sales" name="Bán ra" fill="#2196f3" radius={[0, 10, 10, 0]} barSize={20} />
                            <Bar dataKey="returns" name="Hoàn trả" fill="#ff9800" radius={[0, 10, 10, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>
          </Col>
      </Row>
    </div>
  );
};

export default StatsPage;