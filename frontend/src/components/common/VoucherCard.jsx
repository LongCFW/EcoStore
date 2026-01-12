import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FaCopy, FaTicketAlt, FaShippingFast, FaCrown, FaLeaf } from 'react-icons/fa';

const VoucherCard = ({ voucher }) => {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    alert(`Đã sao chép mã: ${voucher.code}`);
  };

  // Xác định loại voucher để render style
  const getVoucherStyle = (type) => {
    switch(type) {
        case 'shipping': return { class: 'voucher-shipping', icon: <FaShippingFast size={30}/>, label: 'FreeShip' };
        case 'vip': return { class: 'voucher-vip', icon: <FaCrown size={30}/>, label: 'V.I.P' };
        default: return { class: 'voucher-new', icon: <FaLeaf size={30}/>, label: 'Eco Deal' };
    }
  };

  const style = getVoucherStyle(voucher.type);

  return (
    <div className={`voucher-ticket ${style.class} h-100`}>
      {/* Phần trên: Màu sắc & Icon */}
      <div className="voucher-left">
        <div className="text-center">
            <div className="mb-2 opacity-75">{style.icon}</div>
            <span className="fw-bold text-uppercase border border-white px-2 py-1 rounded small">
                {style.label}
            </span>
        </div>
        {/* Vòng tròn trang trí 2 bên tạo hiệu ứng vé */}
        <div className="position-absolute top-50 start-0 translate-middle rounded-circle bg-white" style={{width: 20, height: 20, marginLeft: -1}}></div>
        <div className="position-absolute top-50 end-0 translate-middle rounded-circle bg-white" style={{width: 20, height: 20, marginRight: -11}}></div>
      </div>

      {/* Phần dưới: Nội dung */}
      <div className="p-3 d-flex flex-column flex-grow-1 bg-white">
        <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="fw-bold text-dark mb-0">{voucher.code}</h5>
            <Badge bg="light" text="dark" className="border">Số lượng có hạn</Badge>
        </div>
        
        <p className="fw-bold text-success mb-1" style={{fontSize: '0.95rem'}}>{voucher.description}</p>
        <p className="text-muted small mb-3 flex-grow-1">
            Đơn tối thiểu: {voucher.minOrder.toLocaleString()}đ <br/>
            HSD: {voucher.expiry}
        </p>

        <div className="voucher-divider mb-3"></div>

        <Button 
            variant="outline-success" 
            className="w-100 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleCopy}
        >
            <FaCopy /> Sao chép mã
        </Button>
      </div>
    </div>
  );
};

export default VoucherCard;