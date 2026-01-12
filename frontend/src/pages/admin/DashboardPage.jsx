import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { FaDollarSign, FaShoppingCart, FaUserPlus, FaBoxOpen } from 'react-icons/fa';

// --- KHAI BÁO COMPONENT STATCARD BÊN NGOÀI ---
const StatCard = ({ title, value, icon, color }) => (
  <Card className={`border-0 shadow-sm h-100 border-start border-4 border-${color}`}>
      <Card.Body className="d-flex align-items-center justify-content-between">
          <div>
              <p className="text-muted mb-1 text-uppercase small fw-bold">{title}</p>
              <h3 className="fw-bold mb-0">{value}</h3>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle text-${color}`}>
              {icon}
          </div>
      </Card.Body>
  </Card>
);
// ---------------------------------------------

const DashboardPage = () => {
  // Dữ liệu giả cho biểu đồ Doanh thu (BarChart)
  const dataRevenue = [
    { name: 'Thg 1', revenue: 4000 },
    { name: 'Thg 2', revenue: 3000 },
    { name: 'Thg 3', revenue: 2000 },
    { name: 'Thg 4', revenue: 2780 },
    { name: 'Thg 5', revenue: 1890 },
    { name: 'Thg 6', revenue: 2390 },
    { name: 'Thg 7', revenue: 3490 },
  ];

  // Dữ liệu giả cho biểu đồ Danh mục (PieChart)
  const dataCategory = [
    { name: 'Gia dụng', value: 400 },
    { name: 'Cá nhân', value: 300 },
    { name: 'Vệ sinh', value: 300 },
    { name: 'Quà tặng', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h2 className="fw-bold mb-4">Dashboard</h2>

      {/* 1. Các thẻ thống kê */}
      <Row className="g-4 mb-4">
        <Col md={3}>
            <StatCard title="Doanh thu" value="120.5tr" icon={<FaDollarSign size={24}/>} color="success" />
        </Col>
        <Col md={3}>
            <StatCard title="Đơn hàng mới" value="45" icon={<FaShoppingCart size={24}/>} color="primary" />
        </Col>
        <Col md={3}>
            <StatCard title="Khách hàng" value="1,203" icon={<FaUserPlus size={24}/>} color="info" />
        </Col>
        <Col md={3}>
            <StatCard title="Sản phẩm" value="89" icon={<FaBoxOpen size={24}/>} color="warning" />
        </Col>
      </Row>

      {/* 2. Biểu đồ */}
      <Row className="g-4 mb-4">
        {/* Biểu đồ Doanh thu */}
        <Col lg={8}>
            <Card className="border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-4">Doanh thu 7 tháng gần nhất</h5>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" name="Doanh thu (k$)" fill="#198754" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>

        {/* Biểu đồ Danh mục */}
        <Col lg={4}>
            <Card className="border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-4">Tỷ lệ danh mục</h5>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataCategory}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </Col>
      </Row>

      {/* 3. Đơn hàng gần đây (Bảng nhỏ) */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <h5 className="mb-0 fw-bold">Đơn hàng gần đây</h5>
        </Card.Header>
        <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
                <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>#ORD-009</td>
                    <td>Nguyễn Văn A</td>
                    <td>2025-01-20</td>
                    <td>450.000 đ</td>
                    <td><Badge bg="warning" text="dark">Chờ xử lý</Badge></td>
                </tr>
                <tr>
                    <td>#ORD-008</td>
                    <td>Trần Thị B</td>
                    <td>2025-01-19</td>
                    <td>1.200.000 đ</td>
                    <td><Badge bg="success">Hoàn thành</Badge></td>
                </tr>
                <tr>
                    <td>#ORD-007</td>
                    <td>Lê Văn C</td>
                    <td>2025-01-19</td>
                    <td>85.000 đ</td>
                    <td><Badge bg="danger">Đã hủy</Badge></td>
                </tr>
            </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default DashboardPage;