import React from "react";
import { Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import VoucherCard from "../../components/common/VoucherCard";
import '../../assets/styles/pages.css';

const OffersPage = () => {
  // Dữ liệu giả định phong phú hơn
  const vouchers = [
    { id: 1, type: 'new', code: "ECOSTART", description: "Giảm 10% cho đơn đầu tiên", minOrder: 100000, expiry: "30/12/2025" },
    { id: 2, type: 'shipping', code: "FREESHIP", description: "Miễn phí vận chuyển toàn quốc", minOrder: 300000, expiry: "31/01/2025" },
    { id: 3, type: 'vip', code: "GREENLIFE", description: "Giảm 50k cho đơn từ 500k", minOrder: 500000, expiry: "15/02/2025" },
    { id: 4, type: 'new', code: "TET2025", description: "Lì xì 20k cho mọi đơn hàng", minOrder: 0, expiry: "10/02/2025" },
    { id: 5, type: 'vip', code: "VIPMEMBER", description: "Giảm 15% tối đa 100k", minOrder: 1000000, expiry: "31/12/2025" },
    { id: 6, type: 'shipping', code: "SHIP50", description: "Giảm 50% phí ship", minOrder: 150000, expiry: "30/06/2025" },
  ];

  const renderVouchers = (type) => {
      const list = type === 'all' ? vouchers : vouchers.filter(v => v.type === type);
      return (
        <Row xs={1} md={2} lg={3} className="g-4">
            {list.map((v) => (
                <Col key={v.id}>
                    <VoucherCard voucher={v} />
                </Col>
            ))}
        </Row>
      );
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Hero Banner cho trang Offer */}
      <div className="bg-success py-5 mb-5 text-center text-white position-relative overflow-hidden" 
           style={{backgroundImage: 'linear-gradient(135deg, #0f3d28 0%, #2e7d32 100%)'}}>
          <Container className="position-relative z-1">
              <h1 className="fw-bold display-5 mb-3">Kho Voucher & Ưu Đãi</h1>
              <p className="lead opacity-75 mb-4">Săn mã giảm giá hàng ngày để mua sắm tiết kiệm hơn</p>
              <Button variant="light" className="rounded-pill px-4 fw-bold text-success shadow">Đăng ký nhận tin khuyến mãi</Button>
          </Container>
          {/* Decor Circles */}
          <div className="position-absolute top-0 start-0 bg-white opacity-10 rounded-circle" style={{width: 300, height: 300, transform: 'translate(-30%, -30%)'}}></div>
          <div className="position-absolute bottom-0 end-0 bg-white opacity-10 rounded-circle" style={{width: 200, height: 200, transform: 'translate(30%, 30%)'}}></div>
      </div>

      <Container>
        <div className="bg-white p-4 rounded-4 shadow-sm border">
            <Tabs defaultActiveKey="all" className="mb-4 custom-tabs justify-content-center border-bottom-0">
                <Tab eventKey="all" title="Tất cả">
                    {renderVouchers('all')}
                </Tab>
                <Tab eventKey="shipping" title="Mã Vận Chuyển">
                    {renderVouchers('shipping')}
                </Tab>
                <Tab eventKey="new" title="Khách Hàng Mới">
                    {renderVouchers('new')}
                </Tab>
                <Tab eventKey="vip" title="Voucher VIP">
                    {renderVouchers('vip')}
                </Tab>
            </Tabs>
        </div>

        {/* Section phụ: Quy định sử dụng */}
        <div className="mt-5 text-center">
            <h5 className="fw-bold text-muted mb-3">Quy định sử dụng Voucher</h5>
            <p className="small text-muted w-75 mx-auto">
                Mỗi đơn hàng chỉ được sử dụng 1 mã giảm giá. Mã Freeship có thể áp dụng đồng thời với mã giảm giá sản phẩm (tùy chương trình).
                Vui lòng kiểm tra kỹ hạn sử dụng trước khi thanh toán.
            </p>
        </div>
      </Container>
    </div>
  );
};

export default OffersPage;