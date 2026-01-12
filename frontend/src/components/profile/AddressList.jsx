import React, { useState } from "react";
import { Button, Badge, Row, Col, Modal, Form } from "react-bootstrap";
import { FaPlus, FaTrash, FaPen, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const AddressList = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", address: "123 Đường Lê Lợi, Q.1", isDefault: true },
    { id: 2, name: "Văn Phòng", phone: "0909888999", address: "Tòa nhà Bitexco, Q.1", isDefault: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Xóa địa chỉ này?")) {
      setAddresses(addresses.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (addr) => {
      setEditingAddress(addr);
      setShowModal(true);
  };

  const handleAdd = () => {
      setEditingAddress(null);
      setShowModal(true);
  }

  return (
    <div className="profile-content-card animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h4 className="fw-bold mb-0 text-success"><FaMapMarkerAlt className="me-2"/>Sổ địa chỉ</h4>
        <Button variant="success" size="sm" className="rounded-pill px-3 shadow-sm fw-bold" onClick={handleAdd}>
          <FaPlus className="me-1" /> Thêm địa chỉ
        </Button>
      </div>

      {addresses.map((item) => (
        <div key={item.id} className={`border rounded-4 p-3 mb-3 bg-white shadow-sm transition-all ${item.isDefault ? 'border-success border-2' : 'border-light'}`}>
          <Row className="align-items-center">
            <Col md={9}>
              <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <span className="fw-bold fs-5">{item.name}</span>
                  <div className="vr mx-1"></div>
                  <span className="text-muted">{item.phone}</span>
                  
                  {/* ĐÃ SỬA: Badge nằm ở đây, không dùng position absolute nữa */}
                  {item.isDefault && (
                      <Badge bg="success" className="d-flex align-items-center gap-1 py-1 px-2 rounded-pill">
                          <FaCheckCircle size={10}/> Mặc định
                      </Badge>
                  )}
              </div>
              <p className="text-secondary mb-0 small opacity-75">{item.address}</p>
            </Col>
            
            {/* ĐÃ SỬA: Nút bấm chuyên nghiệp hơn */}
            <Col md={3} className="d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
              <Button variant="light" size="sm" className="rounded-circle p-2 text-primary hover-scale shadow-sm border" title="Chỉnh sửa" onClick={() => handleEdit(item)}>
                  <FaPen size={14}/>
              </Button>
              {!item.isDefault && (
                <Button variant="light" size="sm" className="rounded-circle p-2 text-danger hover-scale shadow-sm border" title="Xóa" onClick={() => handleDelete(item.id)}>
                    <FaTrash size={14}/>
                </Button>
              )}
            </Col>
          </Row>
        </div>
      ))}

      {/* Modal Thêm/Sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="eco-modal">
          <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold text-success">{editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">HỌ VÀ TÊN</Form.Label>
                      <Form.Control type="text" defaultValue={editingAddress?.name} className="modern-input"/>
                  </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">SỐ ĐIỆN THOẠI</Form.Label>
                      <Form.Control type="text" defaultValue={editingAddress?.phone} className="modern-input"/>
                  </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">ĐỊA CHỈ NHẬN HÀNG</Form.Label>
                      <Form.Control as="textarea" rows={3} defaultValue={editingAddress?.address} className="modern-input"/>
                  </Form.Group>
                  <Form.Check type="switch" id="default-switch" label="Đặt làm địa chỉ mặc định" defaultChecked={editingAddress?.isDefault} className="fw-medium text-success"/>
              </Form>
          </Modal.Body>
          <Modal.Footer className="border-0">
              <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">Hủy</Button>
              <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => { alert("Đã lưu!"); setShowModal(false); }}>Lưu Địa Chỉ</Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddressList;