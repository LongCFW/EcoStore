import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaCopy } from 'react-icons/fa';

const VoucherCard = ({ voucher }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    alert(`Đã sao chép mã: ${voucher.code}`);
  };

  return (
    <Card className="border-success mb-3 h-100 shadow-sm" style={{borderLeft: '5px solid #198754'}}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-success mb-1">{voucher.code}</h5>
          <p className="mb-1 fw-bold">{voucher.description}</p>
          <small className="text-muted d-block">Đơn tối thiểu: {voucher.minOrder.toLocaleString()}đ</small>
          <small className="text-muted">HSD: {voucher.expiry}</small>
        </div>
        <div className="ms-3 text-end">
            <Button variant="outline-success" size="sm" onClick={handleCopy}>
                <FaCopy /> Lưu
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VoucherCard;