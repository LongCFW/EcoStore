import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const ProductFilter = () => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="fw-bold mb-3">Danh mục</h5>
        <Form.Group className="mb-4">
            {['Tất cả', 'Chăm sóc cá nhân', 'Đồ gia dụng', 'Túi & Phụ kiện', 'Vệ sinh nhà cửa'].map((cat, idx) => (
                <Form.Check key={idx} type="checkbox" label={cat} className="mb-2" />
            ))}
        </Form.Group>

        <h5 className="fw-bold mb-3">Khoảng giá</h5>
        <Form.Group className="mb-4">
            <Form.Check type="radio" name="price" label="Dưới 100k" className="mb-2" />
            <Form.Check type="radio" name="price" label="100k - 300k" className="mb-2" />
            <Form.Check type="radio" name="price" label="300k - 500k" className="mb-2" />
            <Form.Check type="radio" name="price" label="Trên 500k" className="mb-2" />
        </Form.Group>

        <h5 className="fw-bold mb-3">Đánh giá</h5>
        <Form.Group className="mb-4">
             <Form.Check type="checkbox" label="⭐⭐⭐⭐⭐ (5 sao)" className="mb-2" />
             <Form.Check type="checkbox" label="⭐⭐⭐⭐ trở lên" className="mb-2" />
             <Form.Check type="checkbox" label="⭐⭐⭐ trở lên" className="mb-2" />
        </Form.Group>
        
        <Button variant="success" className="w-100">Áp dụng bộ lọc</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductFilter;