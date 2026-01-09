import { Container, Row, Col, Nav, Tab, Card, Button, Form, Badge, Table, ProgressBar, Pagination } from 'react-bootstrap';

const UserProfilePage = () => {
  return (
    <Container className="py-5">
      <Tab.Container id="user-profile-tabs" defaultActiveKey="dashboard">
        <Row>
          {/* --- SIDEBAR TRÁI --- */}
          <Col lg={3} className="mb-4">
            <div className="profile-sidebar p-4 sticky-top" style={{top: '100px'}}>
                {/* Avatar & Info */}
                <div className="text-center mb-4">
                    <div className="position-relative d-inline-block mb-3">
                        <img src="https://placehold.co/100x100/2E7D32/FFFFFF?text=A" className="rounded-circle border border-3 border-success p-1" alt="Avatar" />
                        <span className="position-absolute bottom-0 end-0 bg-warning p-1 rounded-circle border border-white">
                            <i className="bi bi-star-fill text-white" style={{fontSize: '12px'}}></i>
                        </span>
                    </div>
                    <h5 className="fw-bold mb-1">Nguyễn Văn A</h5>
                    <Badge bg="warning" text="dark" className="rounded-pill px-3">Thành viên Vàng</Badge>
                </div>

                <hr className="my-3 opacity-25"/>

                {/* Menu Navigation */}
                <Nav variant="pills" className="flex-column nav-pills-eco">
                    <Nav.Item>
                        <Nav.Link eventKey="dashboard"><i className="bi bi-grid-fill"></i> Tổng Quan</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="orders"><i className="bi bi-box-seam-fill"></i> Đơn Hàng Của Tôi</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="address"><i className="bi bi-map-fill"></i> Sổ Địa Chỉ</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="account"><i className="bi bi-person-lines-fill"></i> Thông Tin Tài Khoản</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="password"><i className="bi bi-shield-lock-fill"></i> Đổi Mật Khẩu</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="notification">
                            <i className="bi bi-bell-fill"></i> Thông Báo 
                            <Badge bg="danger" className="ms-auto rounded-circle">3</Badge>
                        </Nav.Link>
                    </Nav.Item>
                    <hr className="my-2 opacity-25"/>
                    <Nav.Item>
                        <Nav.Link className="text-danger bg-white hover-bg-danger-subtle"><i className="bi bi-box-arrow-left"></i> Đăng Xuất</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
          </Col>

          {/* --- NỘI DUNG PHẢI --- */}
          <Col lg={9}>
            <Tab.Content>
                {/* 1. DASHBOARD */}
                <Tab.Pane eventKey="dashboard">
                    <div className="member-card mb-4 shadow">
                        <div className="d-flex justify-content-between align-items-center position-relative z-1">
                            <div>
                                <h4 className="fw-bold">Thành viên Vàng</h4>
                                <p className="mb-0 opacity-75">Tích lũy thêm 200 điểm để lên hạng Kim Cương</p>
                            </div>
                            <div className="text-end">
                                <h2 className="display-6 fw-bold mb-0">1,250</h2>
                                <small>Điểm EcoPoint</small>
                            </div>
                        </div>
                        <div className="mt-4 position-relative z-1">
                            <div className="d-flex justify-content-between small mb-1">
                                <span>Tiến độ thăng hạng</span>
                                <span>80%</span>
                            </div>
                            <ProgressBar variant="warning" now={80} style={{height: '8px'}} />
                        </div>
                    </div>

                    <Row className="g-3 mb-4">
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 text-center py-4">
                                <i className="bi bi-bag-check fs-1 text-primary mb-2"></i>
                                <h4 className="fw-bold">12</h4>
                                <span className="text-muted">Đơn hàng đã mua</span>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 text-center py-4">
                                <i className="bi bi-cash-coin fs-1 text-success mb-2"></i>
                                <h4 className="fw-bold">5.2tr</h4>
                                <span className="text-muted">Tổng tiền đã chi</span>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 text-center py-4">
                                <i className="bi bi-heart fs-1 text-danger mb-2"></i>
                                <h4 className="fw-bold">5</h4>
                                <span className="text-muted">Sản phẩm yêu thích</span>
                            </Card>
                        </Col>
                    </Row>
                </Tab.Pane>

                {/* 2. ĐƠN HÀNG (Style Shopee) */}
                <Tab.Pane eventKey="orders">
                    <Card className="border-0 shadow-sm p-3">
                        <h4 className="fw-bold mb-4">Lịch Sử Đơn Hàng</h4>
                        <Tab.Container defaultActiveKey="all">
                            <Nav variant="tabs" className="order-status-tab mb-4 justify-content-between flex-nowrap overflow-auto">
                                <Nav.Item><Nav.Link eventKey="all">Tất cả</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="wait">Chờ thanh toán</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="process">Đang xử lý</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="shipping">Đang vận chuyển</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="done">Hoàn thành</Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link eventKey="cancel">Đã hủy</Nav.Link></Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="all">
                                    {/* Order Item 1 */}
                                    <div className="border rounded p-3 mb-3 bg-white">
                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                                            <span className="fw-bold">#ORD-2024-001</span>
                                            <span className="text-success fw-bold text-uppercase"><i className="bi bi-check-circle-fill"></i> Hoàn thành</span>
                                        </div>
                                        <div className="d-flex gap-3 mb-3">
                                            <img src="https://placehold.co/80x80/E8F5E9/2E7D32" className="rounded" alt="Prod" />
                                            <div>
                                                <h6 className="fw-bold">Bộ Ống Hút Tre Tự Nhiên (x2)</h6>
                                                <small className="text-muted">Phân loại: Xanh lá</small>
                                            </div>
                                            <div className="ms-auto fw-bold">100.000đ</div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top bg-light p-2 rounded">
                                            <span className="text-muted small">Đặt ngày: 12/05/2024</span>
                                            <div>
                                                <span className="me-3">Tổng tiền: <span className="text-danger fw-bold fs-5">130.000đ</span></span>
                                                <Button variant="success" size="sm">Mua Lại</Button>
                                                <Button variant="outline-secondary" size="sm" className="ms-2">Chi Tiết</Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                     {/* Order Item 2 */}
                                     <div className="border rounded p-3 mb-3 bg-white">
                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                                            <span className="fw-bold">#ORD-2024-002</span>
                                            <span className="text-warning fw-bold text-uppercase"><i className="bi bi-truck"></i> Đang giao</span>
                                        </div>
                                        <div className="d-flex gap-3 mb-3">
                                            <img src="https://placehold.co/80x80/F1F8E9/2E7D32" className="rounded" alt="Prod" />
                                            <div>
                                                <h6 className="fw-bold">Túi Vải Canvas (x1)</h6>
                                                <small className="text-muted">Phân loại: Be</small>
                                            </div>
                                            <div className="ms-auto fw-bold">120.000đ</div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top bg-light p-2 rounded">
                                            <span className="text-muted small">Đặt ngày: 15/05/2024</span>
                                            <div>
                                                <span className="me-3">Tổng tiền: <span className="text-danger fw-bold fs-5">150.000đ</span></span>
                                                <Button variant="outline-secondary" size="sm" disabled>Đã gửi hàng</Button>
                                                <Button variant="outline-secondary" size="sm" className="ms-2">Theo Dõi</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Card>
                </Tab.Pane>

                {/* 3. SỔ ĐỊA CHỈ */}
                <Tab.Pane eventKey="address">
                    <Card className="border-0 shadow-sm p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0">Sổ Địa Chỉ</h4>
                            <Button variant="success" size="sm"><i className="bi bi-plus-lg"></i> Thêm Địa Chỉ Mới</Button>
                        </div>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="border rounded p-3 h-100 border-success bg-success-subtle position-relative">
                                    <Badge bg="success" className="position-absolute top-0 end-0 m-2">Mặc định</Badge>
                                    <h6 className="fw-bold">Nguyễn Văn A <span className="fw-normal text-muted">| 0901234567</span></h6>
                                    <p className="text-muted small mb-2">123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
                                    <div className="mt-3">
                                        <a href="#" className="text-success small fw-bold text-decoration-none me-3">Chỉnh sửa</a>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="border rounded p-3 h-100">
                                    <h6 className="fw-bold">Văn phòng <span className="fw-normal text-muted">| 0909999999</span></h6>
                                    <p className="text-muted small mb-2">Tòa nhà Bitexco, Quận 1, TP.HCM</p>
                                    <div className="mt-3">
                                        <a href="#" className="text-success small fw-bold text-decoration-none me-3">Chỉnh sửa</a>
                                        <a href="#" className="text-danger small fw-bold text-decoration-none">Xóa</a>
                                        <Button variant="outline-secondary" size="sm" className="float-end py-0" style={{fontSize: '0.7rem'}}>Thiết lập mặc định</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Tab.Pane>

                {/* 4. TÀI KHOẢN */}
                <Tab.Pane eventKey="account">
                    <Card className="border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4">Hồ Sơ Của Tôi</h4>
                        <Form>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên đăng nhập</Form.Label>
                                        <Form.Control type="text" value="nguyenvana_eco" disabled className="bg-light" />
                                        <Form.Text className="text-muted">Tên đăng nhập không thể thay đổi</Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Họ và tên</Form.Label>
                                        <Form.Control type="text" defaultValue="Nguyễn Văn A" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" defaultValue="a@email.com" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control type="text" defaultValue="0901234567" />
                                    </Form.Group>
                                    <div className="mb-3">
                                        <Form.Label className="d-block">Giới tính</Form.Label>
                                        <Form.Check inline label="Nam" name="gender" type="radio" defaultChecked />
                                        <Form.Check inline label="Nữ" name="gender" type="radio" />
                                        <Form.Check inline label="Khác" name="gender" type="radio" />
                                    </div>
                                    <Button variant="success" className="px-4">Lưu Thay Đổi</Button>
                                </Col>
                                <Col md={4} className="text-center border-start">
                                    <div className="mb-3">
                                        <img src="https://placehold.co/150x150/2E7D32/FFFFFF?text=A" className="rounded-circle img-thumbnail" alt="Avatar" />
                                    </div>
                                    <Button variant="outline-secondary" size="sm">Chọn Ảnh</Button>
                                    <p className="text-muted small mt-2">Dung lượng file tối đa 1 MB<br/>Định dạng: .JPEG, .PNG</p>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Tab.Pane>
                
                {/* 5. ĐỔI MẬT KHẨU */}
                <Tab.Pane eventKey="password">
                     <Card className="border-0 shadow-sm p-4">
                        <h4 className="fw-bold mb-4">Đổi Mật Khẩu</h4>
                        <Form style={{maxWidth: '500px'}}>
                            <Form.Group className="mb-3 position-relative">
                                <Form.Label>Mật khẩu hiện tại</Form.Label>
                                <Form.Control type="password" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu mới</Form.Label>
                                <Form.Control type="password" />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                <Form.Control type="password" />
                            </Form.Group>
                            <Button variant="success">Xác Nhận</Button>
                            <a href="#" className="ms-3 text-muted text-decoration-none">Quên mật khẩu?</a>
                        </Form>
                     </Card>
                </Tab.Pane>

                {/* 6. THÔNG BÁO */}
                <Tab.Pane eventKey="notification">
                    <Card className="border-0 shadow-sm p-4">
                        <div className="d-flex justify-content-between mb-4">
                            <h4 className="fw-bold">Thông Báo Mới Nhất</h4>
                            <a href="#" className="text-success text-decoration-none">Đánh dấu tất cả đã đọc</a>
                        </div>
                        <div className="list-group list-group-flush">
                            <div className="list-group-item list-group-item-action bg-light border-0 rounded mb-2">
                                <div className="d-flex w-100 justify-content-between">
                                    <h6 className="mb-1 fw-bold text-success"><i className="bi bi-gift-fill me-2"></i>Nhận ngay Voucher 50K</h6>
                                    <small className="text-muted">Vừa xong</small>
                                </div>
                                <p className="mb-1 small">Chúc mừng bạn đã thăng hạng thành viên Vàng. Mã giảm giá ECOGOLD50 đã được thêm vào ví.</p>
                            </div>
                            <div className="list-group-item list-group-item-action border-0 rounded mb-2">
                                <div className="d-flex w-100 justify-content-between">
                                    <h6 className="mb-1 fw-bold"><i className="bi bi-truck me-2"></i>Đơn hàng đang đến!</h6>
                                    <small className="text-muted">2 giờ trước</small>
                                </div>
                                <p className="mb-1 small">Đơn hàng #ORD-2024-002 của bạn đang được giao bởi shipper Nguyễn Văn B.</p>
                            </div>
                        </div>
                    </Card>
                </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default UserProfilePage;