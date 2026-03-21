import React, { useState, useEffect, useMemo } from "react";
import { Button, Badge, Row, Col, Modal, Form } from "react-bootstrap";
import { FaPlus, FaTrash, FaPen, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaMapPin, FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import userApi from "../../services/user.service";
import { useAuth } from "../../hooks/useAuth";
import toast from 'react-hot-toast';

const AddressList = () => {
  const { user, login } = useAuth(); 
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [formData, setFormData] = useState({
      fullName: "", phone: "", addressLine: "", city: "", province: "", isDefault: false
  });

  useEffect(() => {
      const fetchLatestProfile = async () => {
          try {
              const res = await userApi.getProfile();
              if (res.success) {
                  login(res.data); 
                  setAddresses(res.data.addresses || []);
              }
          } catch (error) {
              console.error("Lỗi tải profile:", error);
          } finally {
              setFetching(false);
          }
      };
      fetchLatestProfile();
  }, [login]); 

  useEffect(() => {
      if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const refreshUser = async () => {
      try {
          const res = await userApi.getProfile();
          if (res.success) {
              login(res.data);
              setAddresses(res.data.addresses || []);
          }
      } catch (error) {
          console.error("Lỗi làm mới profile", error);
      }
  };

  // --- FIX LỖI SẮP XẾP: LUÔN ĐẨY ĐỊA CHỈ MẶC ĐỊNH LÊN ĐẦU ---
  const sortedAddresses = useMemo(() => {
      if (!addresses) return [];
      return [...addresses].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
  }, [addresses]);

  const handleAdd = () => {
      setEditingAddress(null);
      setFormData({ fullName: user?.name || "", phone: user?.phone || "", addressLine: "", city: "", province: "", isDefault: false });
      setShowModal(true);
  };

  const handleEdit = (addr) => {
      setEditingAddress(addr);
      setFormData({
          fullName: addr.fullName, phone: addr.phone, addressLine: addr.addressLine, 
          city: addr.city, province: addr.province, isDefault: addr.isDefault
      });
      setShowModal(true);
  };

  const handleSave = async () => {
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine.trim() || !formData.city.trim() || !formData.province.trim()) {
          toast.error("Vui lòng điền đầy đủ thông tin!");
          return;
      }
      setLoading(true);
      try {
          let res;
          if (editingAddress) res = await userApi.updateAddress(editingAddress._id, formData);
          else res = await userApi.addAddress(formData);

          if (res.success) {
              toast.success(editingAddress ? "Đã cập nhật địa chỉ!" : "Thêm địa chỉ thành công!");
              setShowModal(false);
              await refreshUser();
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id) => {
      if (window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) {
          try {
              const res = await userApi.deleteAddress(id);
              if (res.success) {
                  toast.success("Đã xóa địa chỉ");
                  await refreshUser();
              }
          } catch {
              toast.error("Lỗi khi xóa địa chỉ");
          }
      }
  };

  const handleSetDefault = async (id) => {
      try {
          const res = await userApi.setDefaultAddress(id);
          if (res.success) {
              toast.success("Đã đặt làm địa chỉ mặc định");
              await refreshUser(); // State đổi -> useMemo sắp xếp lại -> Đẩy lên đầu ngay!
          }
      } catch {
          toast.error("Lỗi cập nhật mặc định");
      }
  };

  if (fetching) {
      return <div className="text-center py-5"><FaSpinner className="fa-spin text-success" size={30}/></div>;
  }

  return (
    <div className="profile-content-card animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h4 className="fw-bold mb-0 text-success"><FaMapMarkerAlt className="me-2"/>Sổ địa chỉ</h4>
        <Button variant="success" size="sm" className="rounded-pill px-4 shadow-sm fw-bold d-flex align-items-center gap-2" onClick={handleAdd}>
          <FaPlus /> Thêm địa chỉ mới
        </Button>
      </div>

      <div className="custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
          {sortedAddresses.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
                  <FaMapMarkerAlt size={50} className="mb-3 text-secondary opacity-50"/>
                  <p className="fs-5 fw-medium">Bạn chưa lưu địa chỉ nào.</p>
                  <Button variant="outline-success" className="rounded-pill px-4" onClick={handleAdd}>Thêm ngay</Button>
              </div>
          ) : (
              <Row className="g-3">
                  {sortedAddresses.map((item) => (
                      <Col xs={12} key={item._id}>
                          <div className={`p-4 bg-white rounded-4 shadow-sm border transition-all ${item.isDefault ? 'border-success border-2 bg-success bg-opacity-10' : 'border-light'}`}>
                              
                              <Row className="align-items-start">
                                  <Col md={12}>
                                      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                          <div className="d-flex align-items-center gap-2 text-dark">
                                              <FaUserAlt className="text-secondary opacity-50"/>
                                              <span className="fw-bold fs-5">{item.fullName}</span>
                                          </div>
                                          <div className="vr mx-2 bg-secondary opacity-25"></div>
                                          <div className="d-flex align-items-center gap-2 text-dark">
                                              <FaPhoneAlt className="text-secondary opacity-50" size={14}/>
                                              <span className="fw-medium">{item.phone}</span>
                                          </div>
                                          
                                          {item.isDefault && (
                                              <Badge bg="success" className="ms-auto d-flex align-items-center gap-1 py-2 px-3 rounded-pill shadow-sm">
                                                  <FaCheckCircle size={12}/> Mặc định
                                              </Badge>
                                          )}
                                      </div>
                                      <div className="d-flex align-items-start gap-2 text-secondary mb-3">
                                          <FaMapPin className="mt-1 flex-shrink-0 text-success opacity-75"/>
                                          <p className="mb-0 lh-lg">
                                              {item.addressLine}, {item.city}, {item.province}
                                          </p>
                                      </div>
                                  </Col>
                              </Row>

                              {/* --- THANH CÔNG CỤ ĐÃ ĐƯỢC LÀM MỊN LẠI --- */}
                              <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10">
                                  <div>
                                      {!item.isDefault && (
                                          <Button variant="link" className="text-decoration-none text-success fw-medium p-0" onClick={() => handleSetDefault(item._id)}>
                                              Thiết lập mặc định
                                          </Button>
                                      )}
                                  </div>
                                  <div className="d-flex gap-3">
                                      <Button variant="link" className="text-decoration-none text-primary p-0 d-flex align-items-center gap-1" onClick={() => handleEdit(item)}>
                                          <FaPen size={12}/> Sửa
                                      </Button>
                                      <Button variant="link" className="text-decoration-none text-danger p-0 d-flex align-items-center gap-1" onClick={() => handleDelete(item._id)}>
                                          <FaTrash size={12}/> Xóa
                                      </Button>
                                  </div>
                              </div>

                          </div>
                      </Col>
                  ))}
              </Row>
          )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="eco-modal">
          <Modal.Header closeButton className="border-0 bg-light">
              <Modal.Title className="fw-bold text-success d-flex align-items-center gap-2">
                  <FaMapMarkerAlt /> {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
              <Form>
                  <Row>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold text-muted">HỌ VÀ TÊN <span className="text-danger">*</span></Form.Label>
                              <Form.Control 
                                type="text" 
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="shadow-none border-secondary border-opacity-25"
                                placeholder="Nhập họ tên"
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold text-muted">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></Form.Label>
                              <Form.Control 
                                type="text" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="shadow-none border-secondary border-opacity-25"
                                placeholder="Nhập SĐT"
                              />
                          </Form.Group>
                      </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted">ĐỊA CHỈ CHI TIẾT <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="textarea" rows={2} 
                        value={formData.addressLine}
                        onChange={(e) => setFormData({...formData, addressLine: e.target.value})}
                        className="shadow-none border-secondary border-opacity-25"
                        placeholder="Số nhà, Tên đường, Phường/Xã..."
                      />
                  </Form.Group>
                  <Row>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold text-muted">QUẬN / HUYỆN <span className="text-danger">*</span></Form.Label>
                              <Form.Control 
                                type="text" 
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="shadow-none border-secondary border-opacity-25"
                                placeholder="Quận/Huyện..."
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label className="small fw-bold text-muted">TỈNH / THÀNH PHỐ <span className="text-danger">*</span></Form.Label>
                              <Form.Control 
                                type="text" 
                                value={formData.province}
                                onChange={(e) => setFormData({...formData, province: e.target.value})}
                                className="shadow-none border-secondary border-opacity-25"
                                placeholder="Tỉnh/Thành phố..."
                              />
                          </Form.Group>
                      </Col>
                  </Row>
                  
                  <div className="bg-light p-3 rounded mt-2 border">
                      <Form.Check 
                        type="switch" 
                        id="default-switch" 
                        label="Đặt làm địa chỉ mặc định" 
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                        className="fw-bold text-success m-0"
                      />
                  </div>
              </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 pb-4 pe-4">
              <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">Hủy</Button>
              <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleSave} disabled={loading}>
                  {loading ? <FaSpinner className="fa-spin"/> : "Lưu Thông Tin"}
              </Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddressList;