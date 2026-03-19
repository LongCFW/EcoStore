import React, { useState, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Row,
  Col,
  Tab,
  Nav,
  InputGroup,
} from "react-bootstrap";
import {
  FaSave,
  FaTimes,
  FaCamera,
  FaImage,
  FaCloudUploadAlt,
} from "react-icons/fa";
import axiosClient from "../../services/axiosClient";

const CategoryModal = ({
  show,
  handleClose,
  category,
  refreshData,
  allCategories = [],
}) => {
  const isEdit = !!category;
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  // Tab chọn ảnh (url / file)
  const [activeTab, setActiveTab] = useState("url");

  // Khởi tạo state NGAY TRONG useState (Bỏ useEffect gây lỗi)
  const existingPId = category?.parentId
    ? typeof category.parentId === "object"
      ? category.parentId._id
      : category.parentId
    : "";

  const [categoryType, setCategoryType] = useState(
    existingPId ? "sub" : "root",
  );
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    imageUrl: category?.imageUrl || "",
    parentId: existingPId,
    isActive: category?.isActive !== undefined ? category.isActive : true,
  });

  // Handle Upload Local File
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Cập nhật preview tạm thời bằng FileReader cho nhanh
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);

    try {
      const formPayload = new FormData();
      formPayload.append("avatar", file); // Mượn API upload avatar
      const res = await axiosClient.post("/auth/upload-avatar", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.success) {
        // Đè lại bằng URL thật từ server
        setFormData((prev) => ({ ...prev, imageUrl: res.avatarUrl }));
        setError("");
      }
    } catch {
      setError("Lỗi khi tải ảnh lên server.");
    }
  };

  // Handle Nhập URL
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    // Reset lỗi khi user đang gõ
    if (error) setError("");
  };

  // Hàm kiểm tra định dạng ảnh cơ bản
  const isValidImageUrl = (url) => {
    if (!url) return true; // Cho phép rỗng
    if (url.startsWith("data:image/")) return true; // Base64 hợp lệ

    try {
      const parsedUrl = new URL(url);
      // Chỉ cần là link http hoặc https là cho phép pass
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        return true;
      }
      return false;
    } catch {
      return false; // Không phải là URL (VD: gõ abcxyz)
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    if (categoryType === "sub" && !formData.parentId) {
      setError("Vui lòng chọn danh mục cha từ danh sách");
      return;
    }

    if (
      activeTab === "url" &&
      formData.imageUrl &&
      !isValidImageUrl(formData.imageUrl)
    ) {
      setError(
        "Đường link URL không hợp lệ (phải bắt đầu bằng http:// hoặc https://).",
      );
      return;
    }

    try {
      const finalParentId = categoryType === "root" ? null : formData.parentId;
      const payload = { ...formData, parentId: finalParentId };

      if (isEdit) {
        await axiosClient.put(`/categories/${category._id}`, payload);
      } else {
        await axiosClient.post("/categories", payload);
      }
      refreshData();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const validParents = allCategories.filter((c) => c._id !== category?._id);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="eco-modal"
      backdrop="static"
    >
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success fs-5">
          {isEdit ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
        </Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}>
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="py-2 small">
            {error}
          </Alert>
        )}

        <Row>
          {/* CỘT TRÁI: KHU VỰC ẢNH (Có Tabs) */}
          <Col xs={12} md={5} className="mb-4 mb-md-0 border-end pe-md-4">
            <Form.Label className="admin-label d-block text-start mb-2 text-center">
              Ảnh đại diện
            </Form.Label>

            {/* Khu vực Preview Ảnh */}
            <div
              className="rounded-4 overflow-hidden border bg-light mx-auto position-relative mb-3"
              style={{ height: "220px", width: "100%" }}
            >
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    // Nếu link lỗi không load được ảnh
                    e.target.src =
                      "https://placehold.co/300x300?text=Error+Loading+Image";
                    if (activeTab === "url")
                      setError("Không thể tải ảnh từ URL này.");
                  }}
                />
              ) : (
                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-secondary opacity-50">
                  <FaImage size={40} className="mb-2" />
                  <small>Chưa có ảnh</small>
                </div>
              )}
            </div>

            {/* Tabs chọn phương thức nhập ảnh */}
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                setError("");
              }}
            >
              <Nav
                variant="pills"
                className="justify-content-center mb-3 text-small"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="url"
                    className="py-1 px-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Link URL
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="file"
                    className="py-1 px-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Tải ảnh lên
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="url">
                  <InputGroup size="sm">
                    <InputGroup.Text className="bg-light border-end-0">
                      <FaImage className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Dán link ảnh (.jpg, .png...)"
                      value={activeTab === "url" ? formData.imageUrl : ""}
                      onChange={handleUrlChange}
                      className="border-start-0 ps-0 shadow-none"
                    />
                  </InputGroup>
                </Tab.Pane>

                <Tab.Pane eventKey="file">
                  <div
                    className="border border-dashed rounded p-3 text-center cursor-pointer hover-bg-light"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCloudUploadAlt size={24} className="text-success mb-2" />
                    <br />
                    <small className="fw-bold text-dark">
                      Click để chọn ảnh từ máy
                    </small>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <Form.Text className="text-muted small d-block mt-2 text-center">
                    Ảnh sẽ được lưu vào hệ thống server.
                  </Form.Text>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          {/* CỘT PHẢI: FORM NHẬP LIỆU (Giữ nguyên) */}
          <Col xs={12} md={7}>
            <Form>
              <Form.Group className="mb-4 border-bottom pb-3">
                <Form.Label className="admin-label d-block text-primary">
                  Cấp Bậc Danh Mục
                </Form.Label>
                <div className="d-flex gap-4 mt-2">
                  <Form.Check
                    type="radio"
                    label={<span className="fw-bold">Danh mục gốc (Cha)</span>}
                    name="categoryType"
                    id="cat-root"
                    checked={categoryType === "root"}
                    onChange={() => setCategoryType("root")}
                    className="cursor-pointer"
                  />
                  <Form.Check
                    type="radio"
                    label="Danh mục con"
                    name="categoryType"
                    id="cat-sub"
                    checked={categoryType === "sub"}
                    onChange={() => setCategoryType("sub")}
                    className="cursor-pointer"
                  />
                </div>
                {categoryType === "root" && (
                  <Form.Text className="text-muted small">
                    * Danh mục này sẽ hiển thị ở tầng ngoài cùng.
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="admin-label">
                  Tên danh mục <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="admin-input shadow-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Rau củ, Trái cây..."
                />
              </Form.Group>

              {categoryType === "sub" && (
                <Form.Group className="mb-3 animate-fade-in">
                  <Form.Label className="admin-label">
                    Thuộc danh mục cha <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    className="admin-input border-primary shadow-none"
                    value={formData.parentId}
                    onChange={(e) =>
                      setFormData({ ...formData, parentId: e.target.value })
                    }
                  >
                    <option value="">-- Click để chọn danh mục cha --</option>
                    {validParents.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="admin-label">Mô tả ngắn</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="admin-input shadow-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Vài nét về danh mục này..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="admin-label">
                  Trạng thái hiển thị
                </Form.Label>
                <Form.Select
                  className="admin-input shadow-none"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Đang hiển thị</option>
                  <option value="false">Tạm ẩn</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4 bg-white">
        <Button
          variant="light"
          onClick={handleClose}
          className="rounded-pill px-4 shadow-none"
        >
          Hủy bỏ
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit}
          className="rounded-pill px-4 fw-bold shadow-sm"
        >
          <FaSave className="me-2" /> Lưu Danh Mục
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
