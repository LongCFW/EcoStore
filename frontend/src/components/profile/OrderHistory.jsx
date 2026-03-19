import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaBoxOpen } from "react-icons/fa";
import orderApi from "../../services/order.service"; 

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
      const fetchMyOrders = async () => {
          try {
              const res = await orderApi.getMyOrders();
              if (res.success) {
                  setOrders(res.data);
              }
          } catch (error) {
              console.error("Lỗi tải lịch sử đơn hàng:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchMyOrders();
  }, []);

  const handleShowDetails = (order) => {
      setSelectedOrder(order);
      setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case "delivered": case "completed": return <Badge bg="success">Giao thành công</Badge>;
        case "shipping": case "confirmed": return <Badge bg="primary">Đang vận chuyển</Badge>;
        case "pending": return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
        case "cancelled": return <Badge bg="secondary">Đã hủy</Badge>;
        default: return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="profile-content-card animate-fade-in">
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-primary"><FaBoxOpen className="me-2"/>Lịch sử đơn hàng</h4>
        
        {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
                <FaBoxOpen size={40} className="mb-3 opacity-50"/>
                <p>Bạn chưa có đơn hàng nào.</p>
            </div>
        ) : (
            // --- ĐÂY LÀ PHẦN ĐÃ ĐƯỢC CHỈNH SỬA SCROLL ---
            <div className="border rounded custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary" style={{ position: 'sticky', top: 0, zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <tr>
                            <th className="ps-3 py-3">Mã đơn</th>
                            <th className="py-3">Ngày đặt</th>
                            <th className="py-3">Tổng tiền</th>
                            <th className="py-3">Trạng thái</th>
                            <th className="text-end pe-3 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="fw-bold text-success ps-3">{order.orderNumber}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="fw-bold">{order.totalAmount_cents?.toLocaleString()} đ</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td className="text-end pe-3">
                                    <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => handleShowDetails(order)}>
                                        <FaEye className="me-1"/> Chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            // ---------------------------------------------
        )}

        {/* Modal Chi Tiết Đơn Hàng */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="eco-modal">
            <Modal.Header closeButton className="border-0 bg-light">
                <Modal.Title className="text-success fw-bold">Chi tiết đơn hàng {selectedOrder?.orderNumber}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 custom-scrollbar">
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(selectedOrder?.createdAt).toLocaleDateString('vi-VN')}</p>
                        <p className="mb-1"><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder?.status)}</p>
                        <p className="mb-1"><strong>Thanh toán:</strong> {selectedOrder?.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : selectedOrder?.paymentMethod}</p>
                    </div>
                    <div className="text-end">
                         <p className="mb-1"><strong>Người nhận:</strong> {selectedOrder?.userId?.name || "Khách"}</p>
                         <p className="mb-1"><strong>SĐT:</strong> {selectedOrder?.phoneNumber}</p>
                         <p className="mb-1 small text-muted" style={{maxWidth: '250px'}}>{selectedOrder?.shippingAddress}</p>
                    </div>
                </div>
                <hr className="my-4"/>
                <h6 className="fw-bold text-muted mb-3">Sản phẩm:</h6>
                
                {/* Phần scroll cho danh sách sản phẩm trong Modal đã có sẵn, giữ nguyên */}
                <div className="table-responsive custom-scrollbar border rounded" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    <Table size="sm" borderless className="mb-0">
                        <thead className="bg-light" style={{ position: 'sticky', top: 0 }}>
                            <tr>
                                <th className="ps-3 py-2">Hình</th>
                                <th className="py-2">Tên sản phẩm</th>
                                <th className="text-center py-2">SL</th>
                                <th className="text-end pe-3 py-2">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder?.items?.map((item, idx) => (
                                <tr key={idx} className="border-bottom">
                                    <td className="ps-3 py-2" style={{width: '70px'}}>
                                        <img src={item.image || 'https://placehold.co/50'} alt="" width="50" height="50" className="rounded object-fit-cover border shadow-sm"/>
                                    </td>
                                    <td className="py-2 align-middle">
                                        <div className="fw-medium text-dark">{item.name}</div>
                                        <small className="text-muted">{item.price_cents?.toLocaleString()} đ</small>
                                    </td>
                                    <td className="text-center align-middle py-2">x{item.quantity}</td>
                                    <td className="text-end fw-bold text-success pe-3 align-middle py-2">{(item.price_cents * item.quantity).toLocaleString()} đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                
                {selectedOrder?.note && (
                    <div className="mt-4 p-3 bg-light rounded border border-warning border-opacity-25">
                        <span className="text-muted fw-bold d-block mb-1">Ghi chú từ khách hàng:</span> 
                        <span className="small text-dark">{selectedOrder.note}</span>
                    </div>
                )}

                <div className="text-end mt-4 pt-3 border-top">
                     <h5 className="text-dark d-inline-block me-3">Tổng thanh toán:</h5>
                     <h3 className="text-success d-inline-block fw-bold m-0">{selectedOrder?.totalAmount_cents?.toLocaleString()} đ</h3>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 pb-4 pe-4">
                <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
};

export default OrderHistory;