import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import VoucherCard from "../../components/common/VoucherCard";

const OffersPage = () => {
  // Dữ liệu giả mã giảm giá
  const vouchers = [
    {
      id: 1,
      code: "ECOSTART",
      description: "Giảm 10% cho đơn đầu tiên",
      minOrder: 100000,
      expiry: "30/12/2025",
    },
    {
      id: 2,
      code: "FREESHIP",
      description: "Miễn phí vận chuyển",
      minOrder: 300000,
      expiry: "31/01/2025",
    },
    {
      id: 3,
      code: "GREENLIFE",
      description: "Giảm 50k cho đơn từ 500k",
      minOrder: 500000,
      expiry: "15/02/2025",
    },
    {
      id: 4,
      code: "TET2025",
      description: "Lì xì 20k cho mọi đơn hàng",
      minOrder: 0,
      expiry: "10/02/2025",
    },
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Kho Mã Giảm Giá</h2>
        <p className="text-muted">
          Thu thập mã giảm giá và áp dụng tại bước thanh toán nhé!
        </p>
      </div>

      <Row xs={1} md={2} lg={2} className="g-4">
        {vouchers.map((v) => (
          <Col key={v.id}>
            <VoucherCard voucher={v} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OffersPage;
