import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { FaCamera, FaSave, FaUser, FaPhoneAlt, FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../services/axiosClient';
import toast from 'react-hot-toast';
import '../../assets/styles/auth-profile.css';

const ProfileInfo = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // States: Thông tin cá nhân
  const [info, setInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
  });
  const [loadingInfo, setLoadingInfo] = useState(false);

  // States: Mật khẩu
  const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  // States: Show/Hide Password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- XỬ LÝ UPLOAD ẢNH ---
  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          toast.error("Vui lòng chọn file hình ảnh!");
          return;
      }
      if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước ảnh phải nhỏ hơn 5MB");
          return;
      }

      const previewUrl = URL.createObjectURL(file);
      setInfo(prev => ({...prev, avatar: previewUrl}));

      try {
          const formData = new FormData();
          formData.append('avatar', file);
          const res = await axiosClient.post('/auth/upload-avatar', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (res.success) {
              updateUser({ avatarUrl: res.avatarUrl }); 
              setInfo(prev => ({...prev, avatar: res.avatarUrl}));
              toast.success("Đã cập nhật ảnh đại diện!");
          }
      } catch (error) {
          console.error("Upload error:", error);
          toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại!");
          setInfo(prev => ({...prev, avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"}));
      }
  };

  const handleChangeInfo = (e) => setInfo({ ...info, [e.target.name]: e.target.value });
  const handleChangePass = (e) => setPass({ ...pass, [e.target.name]: e.target.value });

  // --- API CẬP NHẬT THÔNG TIN ---
  const handleSaveInfo = async () => {
      const phoneTrimmed = info.phone.trim();
      
      if (!info.fullName.trim() || !phoneTrimmed) {
          toast.error("Vui lòng điền đủ Họ Tên và Số điện thoại!");
          return;
      }

      // VALIDATE: Kiểm tra số điện thoại (chỉ chứa số, từ 10 đến 11 ký tự)
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(phoneTrimmed)) {
          toast.error("Số điện thoại không hợp lệ (phải là số và từ 10-11 ký tự)!");
          return;
      }

      setLoadingInfo(true);
      try {
          const res = await axiosClient.put('/auth/profile/update', {
              name: info.fullName.trim(),
              phone: phoneTrimmed
          });

          if (res.success) {
              updateUser({ 
                  name: res.user.name, 
                  phone: res.user.phone 
              });
              toast.success("Cập nhật thông tin thành công!");
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin");
      } finally {
          setLoadingInfo(false);
      }
  };

  // --- Hàm dọn dẹp form mật khẩu ---
  const resetPasswordForm = () => {
      setPass({ current: '', new: '', confirm: '' });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
  };

  // --- API ĐỔI MẬT KHẨU ---
  const handleChangePassword = async () => {
      if (!pass.current || !pass.new || !pass.confirm) {
          toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu!");
          resetPasswordForm();
          return;
      }
      if (pass.new.length < 6) {
          toast.error("Mật khẩu mới phải từ 6 ký tự trở lên!");
          resetPasswordForm();
          return;
      }
      if (pass.new !== pass.confirm) {
          toast.error("Mật khẩu xác nhận không khớp!");
          resetPasswordForm();
          return;
      }
      if (pass.current === pass.new) {
          toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
          resetPasswordForm();
          return;
      }

      setLoadingPass(true);
      try {
          const res = await axiosClient.put('/auth/profile/change-password', {
              currentPassword: pass.current,
              newPassword: pass.new
          });

          if (res.success) {
              toast.success("Đổi mật khẩu thành công!");
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Mật khẩu hiện tại không đúng!");
      } finally {
          setLoadingPass(false);
          // CHỐT CHẶN: Dù try (Thành công) hay catch (Lỗi) thì form vẫn bị xóa trắng
          resetPasswordForm();
      }
  };

  return (
    <div className="profile-content-card animate-fade-in p-2 p-md-4">
        
        {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-success d-flex align-items-center gap-2">
            <FaUser className="fs-5"/> Thông tin cá nhân
        </h4>
        
        <div className="text-center mb-5 position-relative">
            <div className="avatar-container d-inline-block position-relative shadow-sm rounded-circle border border-3 border-white">
                <img src={info.avatar} alt="Avatar" className="avatar-img rounded-circle object-fit-cover" style={{width: 120, height: 120}} />
                <label 
                    className="avatar-upload-btn cursor-pointer position-absolute bottom-0 end-0 bg-success text-white rounded-circle d-flex justify-content-center align-items-center shadow hover-scale" 
                    style={{width: 35, height: 35, transform: 'translate(10%, -10%)'}}
                    onClick={() => fileInputRef.current.click()}
                    title="Đổi ảnh đại diện"
                >
                    <FaCamera size={14}/>
                </label>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept="image/*" 
                    onChange={handleImageChange}
                />
            </div>
            <p className="text-muted small mt-2 fw-medium">Định dạng JPEG, PNG. Dung lượng tối đa 5MB</p>
        </div>

        <Form className="bg-light p-4 rounded-4 border mb-5">
          <Row className="g-4">
             <Col md={12}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">HỌ VÀ TÊN</Form.Label>
                    <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-white border-end-0 text-success"><FaUser/></InputGroup.Text>
                        <Form.Control type="text" name="fullName" value={info.fullName} onChange={handleChangeInfo} className="modern-input border-start-0 ps-0"/>
                    </InputGroup>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">EMAIL <span className="text-danger small fw-normal fst-italic">(Không thể thay đổi)</span></Form.Label>
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-end-0 text-muted"><FaEnvelope/></InputGroup.Text>
                        <Form.Control type="email" value={info.email} disabled readOnly className="border-start-0 ps-0 bg-light text-muted fw-medium" />
                    </InputGroup>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI</Form.Label>
                    <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-white border-end-0 text-success"><FaPhoneAlt/></InputGroup.Text>
                        <Form.Control type="tel" name="phone" value={info.phone} onChange={handleChangeInfo} className="modern-input border-start-0 ps-0" placeholder="Nhập số điện thoại"/>
                    </InputGroup>
                </Form.Group>
             </Col>
          </Row>

          <div className="text-end pt-4 mt-4 border-top">
              <Button variant="success" onClick={handleSaveInfo} disabled={loadingInfo} className="px-5 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2 transition-all hover-scale">
                {loadingInfo ? <Spinner size="sm" /> : <><FaSave /> Cập nhật thông tin</>}
              </Button>
          </div>
        </Form>

        {/* --- PHẦN 2: ĐỔI MẬT KHẨU --- */}
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-danger d-flex align-items-center gap-2 mt-5 pt-3">
            <FaLock className="fs-5"/> Đổi mật khẩu
        </h4>
        
        <Form className="bg-white p-4 rounded-4 border shadow-sm">
            <Row className="g-4">
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-bold small text-secondary">MẬT KHẨU HIỆN TẠI</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="bg-light border-end-0 text-muted"><FaKey/></InputGroup.Text>
                            <Form.Control 
                                type={showCurrent ? "text" : "password"} 
                                name="current" 
                                value={pass.current} 
                                onChange={handleChangePass} 
                                placeholder="••••••••" 
                                className="modern-input border-start-0 border-end-0 ps-0 bg-light" 
                            />
                            <InputGroup.Text className="bg-light border-start-0 cursor-pointer text-muted" onClick={() => setShowCurrent(!showCurrent)}>
                                {showCurrent ? <FaEyeSlash/> : <FaEye/>}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold small text-secondary">MẬT KHẨU MỚI</Form.Label>
                        <InputGroup>
                            <Form.Control 
                                type={showNew ? "text" : "password"} 
                                name="new" 
                                value={pass.new} 
                                onChange={handleChangePass} 
                                placeholder="••••••••" 
                                className="modern-input border-end-0" 
                            />
                            <InputGroup.Text className="bg-white border-start-0 cursor-pointer text-muted" onClick={() => setShowNew(!showNew)}>
                                {showNew ? <FaEyeSlash/> : <FaEye/>}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold small text-secondary">XÁC NHẬN MẬT KHẨU MỚI</Form.Label>
                        <InputGroup>
                            <Form.Control 
                                type={showConfirm ? "text" : "password"} 
                                name="confirm" 
                                value={pass.confirm} 
                                onChange={handleChangePass} 
                                placeholder="••••••••" 
                                className="modern-input border-end-0" 
                            />
                            <InputGroup.Text className="bg-white border-start-0 cursor-pointer text-muted" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <FaEyeSlash/> : <FaEye/>}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>

            <div className="text-end pt-4 mt-4 border-top">
                <Button 
                    variant="danger" 
                    className="px-5 py-2 rounded-pill fw-bold shadow-sm transition-all hover-scale"
                    onClick={handleChangePassword}
                    disabled={loadingPass}
                >
                    {loadingPass ? <Spinner size="sm" /> : "Lưu mật khẩu mới"}
                </Button>
            </div>
        </Form>
    </div>
  );
};

export default ProfileInfo;