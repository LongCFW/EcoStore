import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Spinner,
} from "react-bootstrap";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaLevelUpAlt,
  FaFilter,
  FaSyncAlt,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CategoryModal from "../../components/admin/CategoryModal";
import axiosClient from "../../services/axiosClient";
import "../../assets/styles/admin.css";

// --- COMPONENT HIGHLIGHT TEXT ---
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  // Bỏ qua các ký tự đặc biệt có thể gây lỗi RegExp (như dấu [, ], (, ), \, *, +, vv...)
  const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.toString().split(new RegExp(`(${safeHighlight})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-warning text-dark px-1 rounded p-0">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
};

const CategoryManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  // STATE DEBOUNCE CHO THANH TÌM KIẾM (Để gõ Telex mượt mà)
  const [searchInput, setSearchInput] = useState(searchTerm);

  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalKey, setModalKey] = useState("init");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/categories", {
        params: { limit: 1000 },
      });
      setAllCategories(res.categories || []);
    } catch {
      toast.error("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateParams = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== "page") newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  // DEBOUNCE EFFECT: Đợi 500ms sau khi user NGỪNG GÕ mới cập nhật URL
  useEffect(() => {
    const timer = setTimeout(() => {
      // Chỉ cập nhật nếu giá trị ô input khác với giá trị hiện tại trên URL
      if (searchInput !== searchTerm) {
        updateParams("search", searchInput);
      }
    }, 500); // 500 mili-giây
    return () => clearTimeout(timer); // Xóa timer nếu user gõ tiếp
  }, [searchInput, searchTerm, updateParams]);

  // Cập nhật lại searchInput nếu URL bị thay đổi từ bên ngoài (ví dụ bấm nút Back)
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchParams({}); // Xóa toàn bộ params trên URL
    setSearchInput(""); // Xóa luôn ô text input
  };

  const processedData = useMemo(() => {
    // Lọc theo searchTerm (đã debounce)
    let filtered = allCategories.filter((cat) => {
      const matchSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description &&
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType =
        typeFilter === "all"
          ? true
          : typeFilter === "root"
            ? !cat.parentId
            : !!cat.parentId;
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? cat.isActive
            : !cat.isActive;
      return matchSearch && matchType && matchStatus;
    });

    // Xếp cây
    let treeSorted = [];
    if (typeFilter === "sub") {
      treeSorted = filtered;
    } else {
      const roots = filtered.filter((c) => !c.parentId);
      const subs = filtered.filter((c) => c.parentId);

      roots.forEach((root) => {
        treeSorted.push(root);
        const children = subs.filter((sub) => {
          const pId =
            typeof sub.parentId === "object" ? sub.parentId._id : sub.parentId;
          return pId === root._id;
        });
        treeSorted.push(...children);
      });

      const sortedIds = new Set(treeSorted.map((c) => c._id));
      const orphans = subs.filter((s) => !sortedIds.has(s._id));
      treeSorted.push(...orphans);
    }

    const totalCount = treeSorted.length;
    const rootCount = treeSorted.filter((c) => !c.parentId).length;
    const subCount = treeSorted.filter((c) => c.parentId).length;

    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    const safePage = currentPage > totalPages ? totalPages : currentPage;
    const paginatedItems = treeSorted.slice(
      (safePage - 1) * itemsPerPage,
      safePage * itemsPerPage,
    );

    return {
      totalCount,
      rootCount,
      subCount,
      totalPages,
      paginatedItems,
      safePage,
    };
  }, [allCategories, searchTerm, typeFilter, statusFilter, currentPage]);

  useEffect(() => {
    if (currentPage !== processedData.safePage) {
      updateParams("page", processedData.safePage.toString());
    }
  }, [processedData.safePage, currentPage, updateParams]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalKey(`add-${Date.now()}`);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setModalKey(`edit-${cat._id}`);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axiosClient.delete(`/categories/${id}`);
        toast.success("Đã xóa danh mục thành công!");
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa danh mục");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0" style={{ color: "var(--admin-text)" }}>
            Quản Lý Danh Mục
          </h2>
          <p className="text-muted small m-0 mt-1">
            Sắp xếp và phân cấp danh mục sản phẩm
          </p>
        </div>
        <Button
          variant="success"
          onClick={handleAdd}
          className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow-sm"
        >
          <FaPlus /> Thêm Danh Mục
        </Button>
      </div>

      {/* THỐNG KÊ */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
              style={{ width: "56px", height: "56px" }}
            >
              <FaLayerGroup size={24} />
            </div>
            <div>
              <h3 className="fw-bold m-0 text-dark">
                {processedData.totalCount}
              </h3>
              <span className="text-muted small">Tổng danh mục</span>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
              style={{ width: "56px", height: "56px" }}
            >
              <FaLayerGroup size={24} />
            </div>
            <div>
              <h3 className="fw-bold m-0 text-dark">
                {processedData.rootCount}
              </h3>
              <span className="text-muted small">Danh mục gốc (Cha)</span>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
            <div
              className="bg-info bg-opacity-10 text-info rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
              style={{ width: "56px", height: "56px" }}
            >
              <FaLevelUpAlt size={24} style={{ transform: "rotate(90deg)" }} />
            </div>
            <div>
              <h3 className="fw-bold m-0 text-dark">
                {processedData.subCount}
              </h3>
              <span className="text-muted small">Danh mục con</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* FILTER BAR - GIAO DIỆN MỚI */}
      <div className="table-card p-3 mb-4 bg-white border rounded shadow-sm">
        <Row className="g-3 align-items-center">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm tên, mô tả..."
                className="border-start-0 shadow-none bg-light"
                value={searchInput} // Dùng searchInput thay vì searchTerm
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaFilter className="text-muted" size={12} />
              </InputGroup.Text>
              <Form.Select
                className="border-start-0 shadow-none bg-light"
                value={typeFilter}
                onChange={(e) => updateParams("type", e.target.value)}
              >
                <option value="all">Tất cả cấp bậc</option>
                <option value="root">Chỉ Danh mục gốc (Cha)</option>
                <option value="sub">Chỉ Danh mục con</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              className="shadow-none bg-light"
              value={statusFilter}
              onChange={(e) => updateParams("status", e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="hidden">Đang bị ẩn</option>
            </Form.Select>
          </Col>
          <Col md={2} className="text-end">
            {/* Nút Làm Mới được đưa xuống đây */}
            <Button
              variant="white"
              onClick={handleResetFilters}
              className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 bg-white text-dark border shadow-sm hover-scale"
              style={{ transition: "all 0.2s ease-in-out" }}
              onMouseEnter={(e) => {
                e.currentTarget.classList.replace("bg-white", "bg-light");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.replace("bg-light", "bg-white");
              }}
            >
              <FaSyncAlt /> Làm mới
            </Button>
          </Col>
        </Row>
      </div>

      {/* TABLE */}
      <div
        className="table-card border rounded shadow-sm bg-white"
        style={{ maxHeight: "420px", overflowY: "auto" }}
      >
        <Table hover responsive className="custom-table align-middle mb-0">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f9fa",
              zIndex: 1,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <tr>
              <th className="ps-4 py-3">Tên Danh Mục</th>
              <th className="py-3">Mô Tả</th>
              <th className="py-3">Trạng Thái</th>
              <th className="text-end pe-4 py-3">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                </td>
              </tr>
            ) : processedData.paginatedItems.length > 0 ? (
              processedData.paginatedItems.map((cat) => (
                <tr key={cat._id}>
                  <td className="ps-4">
                    <div
                      className={`d-flex align-items-center gap-3 ${cat.parentId ? "ms-4" : ""}`}
                    >
                      {cat.parentId && (
                        <FaLevelUpAlt
                          className="text-secondary"
                          style={{ transform: "rotate(90deg)" }}
                        />
                      )}

                      <div
                        className="bg-light rounded border d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 45, height: 45 }}
                      >
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt=""
                            className="w-100 h-100 object-fit-cover rounded"
                          />
                        ) : (
                          <FaLayerGroup className="text-secondary opacity-50" />
                        )}
                      </div>

                      <div>
                        <span className="fw-bold text-dark d-block">
                          <HighlightText
                            text={cat.name}
                            highlight={searchTerm}
                          />
                        </span>
                        {cat.parentId ? (
                          <small className="text-muted">
                            Thuộc:{" "}
                            <strong>
                              {typeof cat.parentId === "object"
                                ? cat.parentId.name
                                : cat.parentId}
                            </strong>
                          </small>
                        ) : (
                          <Badge
                            bg="success"
                            className="bg-opacity-10 text-success border border-success mt-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            Danh mục gốc
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    className="text-muted text-truncate"
                    style={{ maxWidth: "250px" }}
                  >
                    <HighlightText
                      text={cat.description || "—"}
                      highlight={searchTerm}
                    />
                  </td>
                  <td>
                    {cat.isActive ? (
                      <Badge
                        bg="success"
                        className="rounded-pill bg-opacity-75 px-3"
                      >
                        Hiển thị
                      </Badge>
                    ) : (
                      <Badge
                        bg="secondary"
                        className="rounded-pill bg-opacity-75 px-3"
                      >
                        Đã ẩn
                      </Badge>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill border shadow-sm text-primary hover-scale me-2"
                      onClick={() => handleEdit(cat)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill border shadow-sm text-danger hover-scale"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  Không tìm thấy danh mục nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
      {processedData.totalPages > 1 && (
        <div className="p-3 border-top d-flex justify-content-center bg-white rounded-bottom shadow-sm mt-2">
          <Pagination className="eco-pagination mb-0">
            <Pagination.Prev
              onClick={() => updateParams("page", processedData.safePage - 1)}
              disabled={processedData.safePage === 1}
            />
            {[...Array(processedData.totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === processedData.safePage}
                onClick={() => updateParams("page", i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => updateParams("page", processedData.safePage + 1)}
              disabled={processedData.safePage === processedData.totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* MODAL */}
      <CategoryModal
        key={modalKey}
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
        refreshData={fetchCategories}
        allCategories={allCategories}
      />
    </div>
  );
};

export default CategoryManager;
