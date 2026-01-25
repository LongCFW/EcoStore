import React, { useState, useRef } from 'react'; // Bỏ useEffect
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaCamera, FaImage } from 'react-icons/fa';
import axiosClient from '../../services/axiosClient';

const CategoryModal = ({ show, handleClose, category, refreshData }) => {
    const isEdit = !!category;
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');
    
    // --- CÁCH CŨ (ADMIN PROFILE STYLE) ---
    // Khởi tạo state MỘT LẦN DUY NHẤT dựa vào prop 'category' truyền vào
    // Khi prop 'key' ở cha thay đổi -> Component này bị hủy và tạo lại -> State được nạp lại mới
    const [formData, setFormData] = useState(() => {
        if (category) {
            return {
                name: category.name || '',
                description: category.description || '',
                imageUrl: category.imageUrl || '',
                isActive: category.isActive !== undefined ? category.isActive : true
            };
        }
        // Mặc định cho thêm mới
        return { 
            name: '', 
            description: '', 
            imageUrl: '', 
            isActive: true 
        };
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const formPayload = new FormData();
            formPayload.append('avatar', file);
            const res = await axiosClient.post('/auth/upload-avatar', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.success) {
                setFormData(prev => ({ ...prev, imageUrl: res.avatarUrl }));
            }
        } catch {
            setError("Lỗi upload ảnh.");
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("Vui lòng nhập tên danh mục");
            return;
        }
        try {
            if (isEdit) {
                await axiosClient.put(`/categories/${category._id}`, formData);
            } else {
                await axiosClient.post('/categories', formData);
            }
            refreshData();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="eco-modal">
            <Modal.Header className="border-0 bg-light">
                <Modal.Title className="fw-bold text-success">
                    {isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                </Modal.Title>
                <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
            </Modal.Header>
            <Modal.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                {/* Upload Ảnh */}
                <div className="text-center mb-4">
                    <div className="category-img-preview border rounded-3 d-flex align-items-center justify-content-center mx-auto position-relative bg-light overflow-hidden"
                        style={{width: '120px', height: '120px', borderStyle: 'dashed !important'}}>
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-100 h-100 object-fit-cover" />
                        ) : (
                            <FaImage size={40} className="text-secondary opacity-50"/>
                        )}
                        <div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-all cursor-pointer"
                            onClick={() => fileInputRef.current.click()}>
                            <FaCamera className="text-white"/>
                        </div>
                    </div>
                    <small className="text-muted mt-2 d-block">Ảnh đại diện</small>
                    <input type="file" ref={fileInputRef} className="d-none" onChange={handleImageChange} accept="image/*"/>
                </div>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold small text-secondary">TÊN DANH MỤC</Form.Label>
                        <Form.Control type="text" className="modern-input" value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ví dụ: Rau củ quả..."/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold small text-secondary">MÔ TẢ</Form.Label>
                        <Form.Control as="textarea" rows={3} className="modern-input" value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold small text-secondary">TRẠNG THÁI</Form.Label>
                        <Form.Select className="modern-input" 
                            value={formData.isActive ? "true" : "false"}
                            onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})}
                        >
                            <option value="true">Hiển thị (Active)</option>
                            <option value="false">Ẩn (Hidden)</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
                <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Hủy</Button>
                <Button variant="success" onClick={handleSubmit} className="rounded-pill px-4 fw-bold shadow-sm">
                    <FaSave className="me-2"/> Lưu lại
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryModal;