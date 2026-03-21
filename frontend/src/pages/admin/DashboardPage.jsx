import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import { 
    FaShoppingBag, FaUsers, FaDollarSign, FaChartLine, 
    FaArrowUp, FaCircle 
} from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useAdminTheme } from '../../context/useAdminTheme';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';
import '../../assets/styles/admin.css';

const DashboardPage = () => {
    const { theme } = useAdminTheme();
    const isDark = theme === 'dark';

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: [],
        topProducts: [],
        revenueData: [],
        categoryData: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/orders/admin/dashboard-stats');
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Dashboard:", error);
                toast.error("Không thể tải dữ liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        if (!amount) return '0 đ';
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        }
        return amount.toLocaleString('vi-VN') + ' đ';
    };

    const COLORS = ['#4caf50', '#ff9800', '#2196f3', '#f44336'];

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': case 'delivered': return <Badge bg="success" className="rounded-pill shadow-sm">Hoàn thành</Badge>;
            case 'shipping': case 'confirmed': return <Badge bg="primary" className="rounded-pill shadow-sm">Vận chuyển</Badge>;
            case 'pending': return <Badge bg="warning" text="dark" className="rounded-pill shadow-sm">Chờ xử lý</Badge>;
            default: return <Badge bg="secondary" className="rounded-pill shadow-sm">Đã hủy</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="grow" variant="success" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Tổng Quan Dashboard</h2>
                    <p className="text-muted small m-0 mt-1">Số liệu trực tiếp từ hệ thống EcoStore</p>
                </div>
                <div className="text-muted small bg-light p-2 rounded-3 border shadow-sm">
                    Cập nhật lúc: <strong className="text-success">{new Date().toLocaleTimeString('vi-VN')}</strong> - {new Date().toLocaleDateString('vi-VN')}
                </div>
            </div>

            {/* 1. KPI CARDS */}
            <Row className="g-4 mb-4">
                <Col md={6} xl={3}>
                    <div className="stat-card stat-primary h-100 hover-scale transition-all">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted mb-1 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>Tổng Doanh Thu</p>
                                <h3 className="fw-bold mb-0 text-primary">{formatCurrency(stats.totalRevenue)}</h3>
                            </div>
                            <div className="stat-icon bg-primary bg-opacity-25 text-primary shadow-sm"><FaDollarSign/></div>
                        </div>
                    </div>
                </Col>

                <Col md={6} xl={3}>
                    <div className="stat-card stat-warning h-100 hover-scale transition-all">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted mb-1 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>Tổng Đơn Hàng</p>
                                <h3 className="fw-bold mb-0 text-warning">{stats.totalOrders}</h3>
                            </div>
                            <div className="stat-icon bg-warning bg-opacity-25 text-warning shadow-sm"><FaShoppingBag/></div>
                        </div>
                    </div>
                </Col>

                <Col md={6} xl={3}>
                    <div className="stat-card stat-info h-100 hover-scale transition-all">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted mb-1 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>Khách Hàng</p>
                                <h3 className="fw-bold mb-0 text-info">{stats.totalUsers}</h3>
                            </div>
                            <div className="stat-icon bg-info bg-opacity-25 text-info shadow-sm"><FaUsers/></div>
                        </div>
                    </div>
                </Col>

                <Col md={6} xl={3}>
                    <div className="stat-card stat-success h-100 hover-scale transition-all">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="text-muted mb-1 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>Đơn Vừa Chốt</p>
                                <h3 className="fw-bold mb-0 text-success">{stats.recentOrders.filter(o => o.status === 'confirmed').length || 0}</h3>
                            </div>
                            <div className="stat-icon bg-success bg-opacity-25 text-success shadow-sm"><FaChartLine/></div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 2. CHARTS SECTION */}
            <Row className="g-4 mb-4">
                {/* BIỂU ĐỒ DOANH THU */}
                <Col lg={8}>
                    <div className="chart-container shadow-sm border-0 rounded-4 transition-all">
                        <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Biểu Đồ Doanh Thu 7 Ngày Qua</h5>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.revenueData}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.5}/>
                                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#444' : '#eee'} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#aaa' : '#666'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#aaa' : '#666'}} />
                                    <Tooltip 
                                        formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']}
                                        labelFormatter={(label) => `Ngày: ${label}`}
                                        contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                                        itemStyle={{ color: '#4caf50', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="uv" stroke="#4caf50" strokeWidth={4} fillOpacity={1} fill="url(#colorUv)" activeDot={{r: 6, strokeWidth: 0, fill: '#4caf50'}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>

                {/* BIỂU ĐỒ TRÒN (PIE CHART) */}
                <Col lg={4}>
                    <div className="chart-container shadow-sm border-0 rounded-4 transition-all">
                        <h5 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Tỷ Trọng Danh Mục</h5>
                        <div style={{ width: '100%', height: 300 }} className="d-flex align-items-center justify-content-center">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={stats.categoryData}
                                        cx="50%" cy="50%"
                                        innerRadius={70} outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => [`${value} sản phẩm`, 'Đã bán']}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '0.85rem', color: 'var(--admin-text)'}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 3. RECENT ORDERS & TOP PRODUCTS */}
            <Row className="g-4">
                <Col lg={8}>
                    <div className="table-card h-100 shadow-sm border-0 rounded-4 overflow-hidden transition-all">
                        <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-light bg-white bg-opacity-75">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2" style={{color: 'var(--admin-text)'}}>
                                <FaShoppingBag className="text-success" /> Đơn Hàng Mới Nhất
                            </h5>
                        </div>
                        <Table hover responsive className="custom-table mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Mã Đơn</th>
                                    <th>Khách Hàng</th>
                                    <th>Ngày Đặt</th>
                                    <th className="text-end">Tổng Tiền</th>
                                    <th className="text-center pe-4">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="transition-all hover-scale-slight">
                                        <td className="ps-4 fw-bold text-success">{order.orderNumber}</td>
                                        <td className="fw-medium" style={{color: 'var(--admin-text)'}}>{order.userId?.name || "Khách Vãng Lai"}</td>
                                        <td className="text-muted small">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="fw-bold text-end text-dark">{order.totalAmount_cents?.toLocaleString()} đ</td>
                                        <td className="text-center pe-4">{getStatusBadge(order.status)}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có đơn hàng nào</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Col>

                {/* SẢN PHẨM HOT TỪ DATABASE */}
                <Col lg={4}>
                    <div className="stat-card h-100 p-0 overflow-hidden shadow-sm border-0 rounded-4 transition-all">
                        <div className="p-4 border-bottom border-light bg-white bg-opacity-75">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2" style={{color: 'var(--admin-text)'}}>
                                <FaChartLine className="text-danger" /> Sản Phẩm Bán Chạy
                            </h5>
                        </div>
                        <div className="p-4">
                            {stats.topProducts.length > 0 ? stats.topProducts.map((product, idx) => (
                                <div key={product._id} className="d-flex align-items-center mb-4 last-mb-0 hover-scale-slight transition-all p-2 rounded-3 hover-bg-light">
                                    <span className={`fw-bold fs-5 me-3 ${idx === 0 ? 'text-warning' : idx === 1 ? 'text-secondary' : 'text-danger'}`}>#{idx + 1}</span>
                                    <img 
                                        src={product.image || `https://placehold.co/100`} 
                                        alt={product.name} 
                                        className="rounded-3 shadow-sm object-fit-cover border"
                                        style={{width: 55, height: 55}}
                                    />
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="fw-bold mb-1 text-truncate" style={{maxWidth: '140px', color: 'var(--admin-text)'}} title={product.name}>{product.name}</h6>
                                        <small className="text-success fw-bold">{product.sold} đã bán</small>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted">Chưa có dữ liệu bán hàng</p>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;