import React from 'react';
import { Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import { 
    FaShoppingBag, FaUsers, FaDollarSign, FaChartLine, 
    FaArrowUp, FaArrowDown, FaEllipsisV, FaCircle 
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useAdminTheme } from '../../context/useAdminTheme'; // Hook lấy theme để chỉnh màu chart
import '../../assets/styles/admin.css';

const DashboardPage = () => {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  const kpiData = [
    { id: 1, title: 'Tổng Doanh Thu', value: '150.2M', icon: <FaDollarSign/>, trend: '+12.5%', isUp: true, color: 'primary' },
    { id: 2, title: 'Đơn Hàng Mới', value: '450', icon: <FaShoppingBag/>, trend: '+8.2%', isUp: true, color: 'warning' },
    { id: 3, title: 'Khách Hàng', value: '1,250', icon: <FaUsers/>, trend: '-2.1%', isUp: false, color: 'info' },
    { id: 4, title: 'Lợi Nhuận', value: '45.8M', icon: <FaChartLine/>, trend: '+10.4%', isUp: true, color: 'danger' },
  ];

  const revenueData = [
    { name: 'T2', uv: 4000, pv: 2400 },
    { name: 'T3', uv: 3000, pv: 1398 },
    { name: 'T4', uv: 2000, pv: 9800 },
    { name: 'T5', uv: 2780, pv: 3908 },
    { name: 'T6', uv: 1890, pv: 4800 },
    { name: 'T7', uv: 2390, pv: 3800 },
    { name: 'CN', uv: 3490, pv: 4300 },
  ];

  const categoryData = [
    { name: 'Rau củ', value: 400 },
    { name: 'Trái cây', value: 300 },
    { name: 'Đồ khô', value: 300 },
    { name: 'Mỹ phẩm', value: 200 },
  ];
  const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#f44336'];

  const recentOrders = [
      { id: '#ORD-001', user: 'Nguyễn Văn A', date: '20/01/2025', total: '550.000đ', status: 'completed' },
      { id: '#ORD-002', user: 'Trần Thị B', date: '19/01/2025', total: '1.200.000đ', status: 'shipping' },
      { id: '#ORD-003', user: 'Lê Văn C', date: '19/01/2025', total: '340.000đ', status: 'pending' },
      { id: '#ORD-004', user: 'Phạm Thị D', date: '18/01/2025', total: '890.000đ', status: 'cancelled' },
  ];

  const getStatusBadge = (status) => {
      switch(status) {
          case 'completed': return <Badge bg="success" className="rounded-pill">Hoàn thành</Badge>;
          case 'shipping': return <Badge bg="primary" className="rounded-pill">Vận chuyển</Badge>;
          case 'pending': return <Badge bg="warning" text="dark" className="rounded-pill">Chờ xử lý</Badge>;
          default: return <Badge bg="secondary" className="rounded-pill">Đã hủy</Badge>;
      }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Tổng Quan Dashboard</h2>
          <div className="text-muted small">Cập nhật: Hôm nay, 20/01/2025</div>
      </div>

      {/* 1. KPI CARDS */}
      <Row className="g-4 mb-4">
          {kpiData.map((item) => (
              <Col md={6} xl={3} key={item.id}>
                  <div className={`stat-card stat-${item.color}`}>
                      <div className="d-flex justify-content-between align-items-start">
                          <div>
                              <p className="text-muted mb-1 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>{item.title}</p>
                              <h3 className="fw-bold mb-0" style={{color: 'var(--admin-text)'}}>{item.value}</h3>
                          </div>
                          <div className={`stat-icon bg-${item.color} bg-opacity-25 text-${item.color}`}>
                              {item.icon}
                          </div>
                      </div>
                      <div className="mt-3 d-flex align-items-center small">
                          <span className={`fw-bold me-2 ${item.isUp ? 'text-success' : 'text-danger'}`}>
                              {item.isUp ? <FaArrowUp size={10}/> : <FaArrowDown size={10}/>} {item.trend}
                          </span>
                          <span className="text-muted">so với tháng trước</span>
                      </div>
                  </div>
              </Col>
          ))}
      </Row>

      {/* 2. CHARTS SECTION */}
      <Row className="g-4 mb-4">
          {/* Revenue Chart */}
          <Col lg={8}>
              <div className="chart-container">
                  <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Biểu Đồ Doanh Thu</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="uv" stroke="#4caf50" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>
          </Col>

          {/* Category Pie Chart */}
          <Col lg={4}>
              <div className="chart-container">
                  <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Danh Mục Bán Chạy</h5>
                  <div style={{ width: '100%', height: 300 }} className="d-flex align-items-center justify-content-center">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2">
                      {categoryData.map((item, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2 small">
                              <div className="d-flex align-items-center">
                                  <FaCircle size={8} color={COLORS[index]} className="me-2"/>
                                  <span style={{color: 'var(--admin-text)'}}>{item.name}</span>
                              </div>
                              <span className="fw-bold text-muted">{item.value} đơn</span>
                          </div>
                      ))}
                  </div>
              </div>
          </Col>
      </Row>

      {/* 3. RECENT ORDERS & TOP PRODUCTS */}
      <Row className="g-4">
          <Col lg={8}>
              <div className="table-card h-100">
                  <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-light">
                      <h5 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Đơn Hàng Gần Đây</h5>
                      <Badge bg="light" text="dark" className="border cursor-pointer">Xem tất cả</Badge>
                  </div>
                  <Table hover responsive className="custom-table mb-0">
                      <thead>
                          <tr>
                              <th>Mã Đơn</th>
                              <th>Khách Hàng</th>
                              <th>Ngày Đặt</th>
                              <th>Tổng Tiền</th>
                              <th>Trạng Thái</th>
                          </tr>
                      </thead>
                      <tbody>
                          {recentOrders.map((order, idx) => (
                              <tr key={idx}>
                                  <td className="fw-bold text-primary">{order.id}</td>
                                  <td>{order.user}</td>
                                  <td>{order.date}</td>
                                  <td className="fw-bold">{order.total}</td>
                                  <td>{getStatusBadge(order.status)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>
              </div>
          </Col>

          <Col lg={4}>
              <div className="stat-card h-100 p-0 overflow-hidden">
                  <div className="p-4 border-bottom border-light">
                      <h5 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Top Sản Phẩm</h5>
                  </div>
                  <div className="p-4">
                      {[1,2,3,4].map((i) => (
                          <div key={i} className="d-flex align-items-center mb-4 last-mb-0">
                              <img 
                                  src={`https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=100&q=80`} 
                                  alt="Product" 
                                  className="rounded-3 border"
                                  style={{width: 50, height: 50, objectFit: 'cover'}}
                              />
                              <div className="ms-3 flex-grow-1">
                                  <h6 className="fw-bold mb-1 text-truncate" style={{maxWidth: '150px', color: 'var(--admin-text)'}}>Bàn chải tre Eco {i}</h6>
                                  <small className="text-muted">150 đã bán</small>
                              </div>
                              <span className="fw-bold text-success">50k</span>
                          </div>
                      ))}
                  </div>
              </div>
          </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;