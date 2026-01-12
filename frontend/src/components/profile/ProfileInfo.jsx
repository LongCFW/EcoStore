import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const ProfileInfo = () => {
  // Dữ liệu giả định lấy từ API
  const [info, setInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    gender: "male",
    birthday: "1995-10-20",
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h4 className="fw-bold mb-4">Hồ sơ của tôi</h4>
        <Form>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={info.fullName}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={info.email}
                  disabled
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  Email không thể thay đổi.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={info.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Nam"
                    name="gender"
                    value="male"
                    checked={info.gender === "male"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Nữ"
                    name="gender"
                    value="female"
                    checked={info.gender === "female"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Khác"
                    name="gender"
                    value="other"
                    checked={info.gender === "other"}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="birthday">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={info.birthday}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="success" className="mt-3 px-4">
            Lưu thay đổi
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileInfo;
