import React, { useState, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Nav,
  Tab,
  Table,
} from "react-bootstrap";
import {
  FaSave,
  FaTimes,
  FaImage,
  FaCloudUploadAlt,
  FaTag,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const DEFAULT_PREVIEW = "https://placehold.co/300x300?text=No+Image";

const ProductModal = ({
  show,
  handleClose,
  product,
  onSave,
  categories = [],
  availableBrands = [],
}) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("url");
  const [brandMode, setBrandMode] = useState(
    product && product.brand && !availableBrands.includes(product.brand)
      ? "new"
      : "select",
  );

  const getCategoryId = (prod) => {
    if (!prod || !prod.categoryId) return "";
    return typeof prod.categoryId === "object"
      ? prod.categoryId._id
      : prod.categoryId;
  };

  // 1. STATE SẢN PHẨM CHUNG
  const [formData, setFormData] = useState(() => {
    if (product) {
      const img = product.images?.[0]?.imageUrl || "";
      return {
        id: product._id || product.id,
        name: product.name || "",
        category: getCategoryId(product),
        brand: product.brand || "",
        price_cents: product.price_cents || 0, // Giá hiển thị mặc định của SP
        description: product.description || "",
        imageUrl: img,
        preview: img || DEFAULT_PREVIEW,
      };
    }
    return {
      name: "",
      category: "",
      brand: "",
      price_cents: "",
      description: "",
      imageUrl: "",
      preview: DEFAULT_PREVIEW,
    };
  });

  // 2. STATE BIẾN THỂ (Mảng động)
  const [variants, setVariants] = useState(() => {
    if (product && product.variants && product.variants.length > 0) {
      return product.variants.map((v) => ({
        id: v._id || Date.now() + Math.random(),
        name: v.name || "",
        sku: v.sku || "",
        price_cents: v.price_cents || 0,
        stock: v.stock || 0,
      }));
    }
    // Mặc định có 1 dòng biến thể trống
    return [
      { id: Date.now(), name: "Mặc định", sku: "", price_cents: "", stock: 0 },
    ];
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      imageUrl: url,
      preview: url || DEFAULT_PREVIEW,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageUrl: reader.result,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LOGIC XỬ LÝ BIẾN THỂ ---
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        name: "",
        sku: "",
        price_cents: formData.price_cents || 0,
        stock: 0,
      },
    ]);
  };

  const removeVariant = (id) => {
    if (variants.length === 1) return alert("Phải có ít nhất 1 biến thể!");
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  // --- SUBMIT TỔNG ---
  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.brand ||
      variants.length === 0
    ) {
      alert(
        "Vui lòng điền đủ tên, danh mục, thương hiệu và ít nhất 1 biến thể!",
      );
      return;
    }

    // Định dạng lại mảng biến thể để gửi lên DB
    const formattedVariants = variants.map((v) => ({
      name: v.name || "Default",
      sku:
        v.sku ||
        `SKU-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      price_cents: Number(v.price_cents) || 0,
      stock: Number(v.stock) || 0,
    }));

    // Tự động lấy giá của biến thể đầu tiên làm giá chung cho Sản Phẩm nếu user không nhập
    const basePrice =
      Number(formData.price_cents) || formattedVariants[0].price_cents;

    const payload = {
      name: formData.name,
      categoryId: formData.category,
      brand: formData.brand,
      price_cents: basePrice,
      description: formData.description,
      images: formData.imageUrl ? [{ imageUrl: formData.imageUrl }] : [],
      variants: formattedVariants,
    };

    if (formData.id) payload.id = formData.id;
    onSave(payload);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      className="eco-modal"
      scrollable
      backdrop="static"
    >
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success fs-5">
          {product ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        </Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}>
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        <Row>
          {/* CỘT TRÁI: ẢNH VÀ THÔNG TIN CƠ BẢN */}
          <Col xs={12} lg={4} className="mb-4 mb-lg-0 border-end pe-lg-4">
            <div className="text-center mb-3">
              <div
                className="rounded-4 overflow-hidden border bg-light mx-auto position-relative"
                style={{ height: "220px", width: "100%" }}
              >
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => (e.target.src = DEFAULT_PREVIEW)}
                />
              </div>
            </div>

            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Nav
                variant="pills"
                className="justify-content-center mb-3 text-small"
              >
                <Nav.Item>
                  <Nav.Link eventKey="url" className="py-1 px-3">
                    Link URL
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="file" className="py-1 px-3">
                    Tải ảnh lên
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="mb-4">
                <Tab.Pane eventKey="url">
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <FaImage />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Dán link ảnh..."
                      value={activeTab === "url" ? formData.imageUrl : ""}
                      onChange={handleUrlChange}
                    />
                  </InputGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="file">
                  <div
                    className="border border-dashed rounded p-2 text-center hover-bg-light cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCloudUploadAlt size={20} className="text-success mb-1" />
                    <br />
                    <small className="fw-bold">Chọn ảnh từ máy</small>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

            <Form.Group className="mb-3">
              <Form.Label className="admin-label">
                Giá chung (Hiển thị) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="price_cents"
                value={formData.price_cents}
                onChange={handleChange}
                className="admin-input"
                placeholder="VD: 150000"
              />
              <Form.Text className="text-muted small">
                Giá trị này dùng để hiển thị ngoài trang chủ.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="admin-label">Mô tả ngắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="admin-input"
                placeholder="Mô tả sản phẩm..."
              />
            </Form.Group>
          </Col>

          {/* CỘT PHẢI: FORM CHÍNH & BẢNG BIẾN THỂ */}
          <Col xs={12} lg={8}>
            <Row className="g-3 mb-4">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="admin-label">
                    Tên sản phẩm <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="admin-input fs-5 fw-bold text-success"
                    placeholder="Nhập tên sản phẩm..."
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="admin-label">
                    Danh mục <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="admin-input"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="admin-label m-0">
                      Thương hiệu <span className="text-danger">*</span>
                    </Form.Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-decoration-none p-0"
                      onClick={() => {
                        setBrandMode((prev) =>
                          prev === "select" ? "new" : "select",
                        );
                        setFormData({ ...formData, brand: "" });
                      }}
                    >
                      {brandMode === "select" ? "+ Thêm mới" : "Chọn có sẵn"}
                    </Button>
                  </div>
                  {brandMode === "select" ? (
                    <Form.Select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="admin-input"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {availableBrands.map((b, idx) => (
                        <option key={idx} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="Khác">Khác</option>
                    </Form.Select>
                  ) : (
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FaTag className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="admin-input border-start-0 ps-0"
                        placeholder="Nhập tên thương hiệu mới..."
                      />
                    </InputGroup>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* --- KHU VỰC QUẢN LÝ BIẾN THỂ --- */}
            <div className="d-flex justify-content-between align-items-center mb-2 mt-4 pt-3 border-top">
              <h6 className="fw-bold m-0 text-dark">
                Quản lý Phân loại / Biến thể
              </h6>
              <Button
                variant="outline-success"
                size="sm"
                onClick={addVariant}
                className="rounded-pill d-flex align-items-center gap-1"
              >
                <FaPlus /> Thêm phân loại
              </Button>
            </div>

            <div className="table-responsive border rounded-3 overflow-hidden">
              <Table
                hover
                className="m-0 align-middle text-center"
                style={{ fontSize: "0.9rem" }}
              >
                <thead className="bg-light">
                  <tr>
                    <th className="text-start ps-3">Phân loại (Màu/Size...)</th>
                    <th>Mã SKU</th>
                    <th style={{ width: "120px" }}>Giá bán (đ)</th>
                    <th style={{ width: "100px" }}>Tồn kho</th>
                    <th style={{ width: "60px" }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="ps-2">
                        <Form.Control
                          size="sm"
                          type="text"
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="VD: Đỏ, 30g..."
                          className="shadow-none"
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "sku",
                              e.target.value,
                            )
                          }
                          placeholder="Tự động tạo nếu để trống"
                          className="shadow-none text-muted"
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          type="number"
                          value={variant.price_cents}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price_cents",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="shadow-none text-success fw-bold"
                        />
                      </td>
                      <td>
                        <Form.Control
                          size="sm"
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "stock",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="shadow-none"
                        />
                      </td>
                      <td>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger border-0 hover-bg-light rounded-circle"
                          onClick={() => removeVariant(variant.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <small className="text-muted mt-2 d-block">
              * Mỗi sản phẩm cần ít nhất 1 biến thể (có thể là biến thể "Mặc
              định"). Nếu để trống SKU, hệ thống sẽ tự động sinh mã.
            </small>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4 bg-white">
        <Button
          variant="light"
          onClick={handleClose}
          className="rounded-pill px-4"
        >
          Hủy bỏ
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          className="rounded-pill px-4 fw-bold shadow-sm"
        >
          <FaSave className="me-2" /> Lưu Sản Phẩm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
