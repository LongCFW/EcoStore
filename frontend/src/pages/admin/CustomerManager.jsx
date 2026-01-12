import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaEye, FaUnlock, FaLock } from 'react-icons/fa';
import CustomerDetailModal from '../../components/admin/CustomerDetailModal';

const CustomerManager = () => {
  // Dữ liệu giả
  const [customers, setCustomers] = useState([
    { 
        id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0901234567", 
        avatar: "https://via.placeholder.com/150", address: "123 Lê Lợi, Q1, TP.HCM", 
        joinDate: "20/01/2024", status: "Active", totalOrders: 15 
    },
    { 
        id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0909888777", 
        avatar: "https://via.placeholder.com/150", address: "456 Nguyễn Huệ, Q1, TP.HCM", 
        joinDate: "15/05/2024", status: "Active", totalOrders: 3 
    },
    { 
        id: 3, name: "Lê Văn C (Bom hàng)", email: "levanc@gmail.com", phone: "0912345678", 
        avatar: "https://via.placeholder.com/150", address: "789 CMT8, Q3, TP.HCM", 
        joinDate: "10/11/2024", status: "Locked", totalOrders: 0 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mở modal
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Xử lý Khóa / Mở khóa
  const handleToggleStatus = (id, newStatus) => {
    if(window.confirm(`Bạn có chắc muốn ${newStatus === 'Locked' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này?`)) {
        setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
        // Cập nhật luôn cho modal đang mở (nếu có)
        if (selectedCustomer && selectedCustomer.id === id) {
            setSelectedCustomer({ ...selectedCustomer, status: newStatus });
        }
    }
  };

  // Logic tìm kiếm
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <h2 className="fw-bold mb-4">Quản lý Khách hàng</h2>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <InputGroup style={{ maxWidth: '400px' }}>
                <InputGroup.Text className="bg-white"><FaSearch className="text-muted"/></InputGroup.Text>
                <Form.Control 
                    placeholder="Tìm kiếm theo tên, email hoặc SĐT..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light text-secondary">
                    <tr>
                        <th className="ps-4">Khách hàng</th>
                        <th>Liên hệ</th>
                        <th>Ngày tham gia</th>
                        <th className="text-center">Đơn hàng</th>
                        <th>Trạng thái</th>
                        <th className="text-end pe-4">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length > 0 ? filteredCustomers.map(cust => (
                        <tr key={cust.id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={cust.avatar} alt="" className="rounded-circle" style={{width: 40, height: 40}} />
                                    <div>
                                        <div className="fw-bold">{cust.name}</div>
                                        <div className="text-muted small">{cust.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{cust.email}</div>
                                <div className="text-muted small">{cust.phone}</div>
                            </td>
                            <td>{cust.joinDate}</td>
                            <td className="text-center fw-bold">{cust.totalOrders}</td>
                            <td>
                                {cust.status === 'Active' 
                                    ? <Badge bg="success">Hoạt động</Badge> 
                                    : <Badge bg="danger">Đã khóa</Badge>
                                }
                            </td>
                            <td className="text-end pe-4">
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleViewCustomer(cust)}>
                                    <FaEye />
                                </Button>
                                {cust.status === 'Active' ? (
                                    <Button variant="outline-danger" size="sm" title="Khóa tài khoản" onClick={() => handleToggleStatus(cust.id, 'Locked')}>
                                        <FaLock />
                                    </Button>
                                ) : (
                                    <Button variant="outline-success" size="sm" title="Mở khóa" onClick={() => handleToggleStatus(cust.id, 'Active')}>
                                        <FaUnlock />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                             <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy khách hàng nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Card.Body>
         <Card.Footer className="bg-white py-3 text-end">
             <small className="text-muted">Hiển thị {filteredCustomers.length} khách hàng</small>
        </Card.Footer>
      </Card>

      {/* Modal Chi Tiết */}
      <CustomerDetailModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        customer={selectedCustomer}
        handleToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default CustomerManager;