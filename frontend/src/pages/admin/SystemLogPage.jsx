import React, { useState } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import { FaShieldAlt, FaFilter, FaDownload } from 'react-icons/fa';

const SystemLogPage = () => {
  // Dữ liệu giả: Nhật ký thao tác của nhân viên/quản lý
  const [logs] = useState([
    { id: 101, actor: 'Nhân viên B', role: 'Staff', action: 'UPDATE_ORDER', target: 'Order #ORD-001', detail: 'Đổi trạng thái sang Đang giao hàng', time: '20/01/2025 14:00', ip: '192.168.1.5' },
    { id: 102, actor: 'Quản lý A', role: 'Manager', action: 'DELETE_PRODUCT', target: 'Product #SP005', detail: 'Xóa sản phẩm "Ống hút nhựa cũ"', time: '20/01/2025 11:30', ip: '192.168.1.2' },
    { id: 103, actor: 'Admin User', role: 'Admin', action: 'LOGIN', target: 'System', detail: 'Đăng nhập vào trang quản trị', time: '20/01/2025 08:00', ip: '192.168.1.10' },
    { id: 104, actor: 'Nhân viên B', role: 'Staff', action: 'VIEW_CUSTOMER', target: 'Customer #CUS002', detail: 'Xem chi tiết hồ sơ Trần Thị B', time: '19/01/2025 16:45', ip: '192.168.1.5' },
    { id: 105, actor: 'Quản lý A', role: 'Manager', action: 'CREATE_PRODUCT', target: 'Product #SP099', detail: 'Thêm mới sản phẩm "Túi rác tự hủy"', time: '19/01/2025 10:00', ip: '192.168.1.2' },
  ]);

  const getActionBadge = (action) => {
      if (action.includes('DELETE')) return <Badge bg="danger">DELETE</Badge>;
      if (action.includes('UPDATE')) return <Badge bg="warning" text="dark">UPDATE</Badge>;
      if (action.includes('CREATE')) return <Badge bg="success">CREATE</Badge>;
      if (action.includes('LOGIN')) return <Badge bg="info">LOGIN</Badge>;
      return <Badge bg="secondary">VIEW</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-danger"><FaShieldAlt className="me-2"/>Nhật ký hệ thống (Audit Log)</h2>
        <Button variant="outline-secondary" size="sm">
            <FaDownload className="me-2"/>Xuất báo cáo
        </Button>
      </div>

      <div className="alert alert-warning border-0 shadow-sm mb-4">
        <strong>Lưu ý:</strong> Khu vực này chỉ dành cho <strong>Admin</strong>. Ghi lại toàn bộ thao tác nhạy cảm của nhân viên và quản lý để phục vụ tra soát.
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <Row className="g-3">
                <Col md={3}>
                    <Form.Select size="sm">
                        <option>Tất cả vai trò</option>
                        <option>Manager</option>
                        <option>Staff</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select size="sm">
                        <option>Tất cả hành động</option>
                        <option>Create</option>
                        <option>Update</option>
                        <option>Delete</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Control type="date" size="sm" />
                </Col>
                <Col md={3} className="text-end">
                    <Button variant="primary" size="sm"><FaFilter /> Lọc dữ liệu</Button>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle font-monospace" style={{fontSize: '0.9rem'}}>
                <thead className="bg-light text-secondary">
                    <tr>
                        <th>Thời gian</th>
                        <th>Người thực hiện</th>
                        <th>Hành động</th>
                        <th>Đối tượng</th>
                        <th>Chi tiết</th>
                        <th>IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>{log.time}</td>
                            <td>
                                <span className="fw-bold">{log.actor}</span>
                                <div className="text-muted small" style={{fontSize: '0.75rem'}}>{log.role}</div>
                            </td>
                            <td>{getActionBadge(log.action)}</td>
                            <td className="fw-bold text-primary">{log.target}</td>
                            <td>{log.detail}</td>
                            <td className="text-muted">{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card.Body>
        <Card.Footer className="bg-white py-2 text-end text-muted small">
            Tổng cộng: {logs.length} bản ghi
        </Card.Footer>
      </Card>
    </div>
  );
};

export default SystemLogPage;