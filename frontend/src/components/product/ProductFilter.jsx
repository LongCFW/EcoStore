import React from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { FaFilter, FaStar } from 'react-icons/fa';

const ProductFilter = () => {
  return (
    <div className="filter-sidebar">
      <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
        <FaFilter className="text-success" />
        <h5 className="fw-bold m-0">Bộ Lọc Tìm Kiếm</h5>
      </div>

      {/* Accordion cho các nhóm lọc để gọn gàng */}
      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
        
        {/* 1. DANH MỤC */}
        <Accordion.Item eventKey="0" className="border-0 mb-3">
            <Accordion.Header><span className="fw-bold">Danh Mục Sản Phẩm</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                {['Rau củ hữu cơ', 'Trái cây tươi', 'Thịt & Hải sản', 'Hạt & Ngũ cốc', 'Đồ uống healthy', 'Combo tiết kiệm'].map((cat, idx) => (
                    <Form.Check 
                        key={idx} 
                        type="checkbox" 
                        label={cat} 
                        id={`cat-${idx}`}
                        className="mb-2 text-secondary custom-checkbox" 
                    />
                ))}
            </Accordion.Body>
        </Accordion.Item>

        {/* 2. KHOẢNG GIÁ */}
        <Accordion.Item eventKey="1" className="border-0 mb-3">
            <Accordion.Header><span className="fw-bold">Khoảng Giá</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                <div className="d-flex flex-column gap-2">
                    <Form.Check type="radio" name="price" label="Dưới 100.000đ" id="p1"/>
                    <Form.Check type="radio" name="price" label="100.000đ - 300.000đ" id="p2"/>
                    <Form.Check type="radio" name="price" label="300.000đ - 500.000đ" id="p3"/>
                    <Form.Check type="radio" name="price" label="Trên 500.000đ" id="p4"/>
                </div>
                {/* Input range tự nhập (Giả lập) */}
                <div className="d-flex gap-2 mt-3 align-items-center">
                    <Form.Control size="sm" placeholder="Từ" />
                    <span>-</span>
                    <Form.Control size="sm" placeholder="Đến" />
                </div>
                <Button variant="outline-success" size="sm" className="w-100 mt-2 rounded-pill">Áp dụng</Button>
            </Accordion.Body>
        </Accordion.Item>

        {/* 3. ĐÁNH GIÁ */}
        <Accordion.Item eventKey="2" className="border-0">
            <Accordion.Header><span className="fw-bold">Đánh Giá</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                {[5, 4, 3].map(star => (
                    <Form.Check 
                        key={star}
                        type="checkbox"
                        id={`star-${star}`}
                        label={
                            <div className="d-flex align-items-center text-warning">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < star ? "" : "text-muted opacity-25"} />
                                ))}
                                <span className="text-dark ms-2 small">từ {star} sao</span>
                            </div>
                        }
                        className="mb-2"
                    />
                ))}
            </Accordion.Body>
        </Accordion.Item>

      </Accordion>

      <Button variant="success" className="w-100 mt-4 rounded-pill py-2 fw-bold shadow-sm">
        Lọc Kết Quả
      </Button>
    </div>
  );
};

export default ProductFilter;