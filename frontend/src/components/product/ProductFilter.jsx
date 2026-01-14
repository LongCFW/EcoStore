import React, { useEffect, useState } from 'react';
import { Form, Button, Accordion, Spinner } from 'react-bootstrap';
import { FaFilter, FaRedo } from 'react-icons/fa';
import categoryApi from '../../services/category.service';

// Định nghĩa các khoảng giá (Value dạng chuỗi "min-max" để dễ xử lý trên URL)
const PRICE_RANGES = [
    { label: "Dưới 100k", value: "0-100000" },
    { label: "100k - 300k", value: "100000-300000" },
    { label: "300k - 500k", value: "300000-500000" },
    { label: "Trên 500k", value: "500000-999999999" }
];

const ProductFilter = ({ onFilter, onReset, availableBrands = [], initialFilters }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE ---
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]); 

  // Sync state khi initialFilters thay đổi (F5 hoặc URL change)
  useEffect(() => {
      if (initialFilters) {
          setSelectedCats(initialFilters.categoryIds || []);
          setSelectedBrands(initialFilters.brands || []);
          setSelectedPrices(initialFilters.priceRanges || []); 
      }
  }, [initialFilters]);

  // Lấy danh mục từ API
  useEffect(() => {
      const fetchCategories = async () => {
          try {
              const response = await categoryApi.getAll();
              setCategories(response.data || []);
          } catch (error) {
              console.error("Lỗi tải danh mục:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchCategories();
  }, []);

  // --- LOGIC GỬI DỮ LIỆU ---
  const triggerFilter = (newCats, newBrands, newPrices) => {
      onFilter({
          categoryIds: newCats ?? selectedCats,
          brands: newBrands ?? selectedBrands,
          priceRanges: newPrices ?? selectedPrices 
      });
  };

  // 1. Chọn Danh mục
  const handleCatChange = (catId) => {
      const newCats = selectedCats.includes(catId) 
          ? selectedCats.filter(id => id !== catId) 
          : [...selectedCats, catId];
      setSelectedCats(newCats);
      triggerFilter(newCats, null, null);
  };

  // 2. Chọn Brand
  const handleBrandChange = (brandName) => {
      const newBrands = selectedBrands.includes(brandName) 
          ? selectedBrands.filter(b => b !== brandName) 
          : [...selectedBrands, brandName];
      setSelectedBrands(newBrands);
      triggerFilter(null, newBrands, null);
  };

  // 3. Chọn Giá (Đã đổi sang Checkbox logic)
  const handlePriceChange = (rangeValue) => {
      const newPrices = selectedPrices.includes(rangeValue)
          ? selectedPrices.filter(p => p !== rangeValue) // Bỏ chọn
          : [...selectedPrices, rangeValue]; // Chọn thêm
      
      setSelectedPrices(newPrices);
      triggerFilter(null, null, newPrices);
  };

  // 4. Reset
  const handleResetFilter = () => {
      setSelectedCats([]);
      setSelectedBrands([]);
      setSelectedPrices([]);
      onReset(); 
  };

  return (
    <div className="filter-sidebar">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
            <FaFilter className="text-success" />
            <h5 className="fw-bold m-0">Bộ Lọc</h5>
        </div>
        <Button variant="link" size="sm" className="text-muted text-decoration-none p-0" onClick={handleResetFilter}>
            <FaRedo className="me-1"/> Reset
        </Button>
      </div>

      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
        
        {/* DANH MỤC */}
        <Accordion.Item eventKey="0" className="border-0 mb-3">
            <Accordion.Header><span className="fw-bold">Danh Mục</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                {loading ? <Spinner animation="border" variant="success" size="sm" /> : (
                    categories.length > 0 ? categories.map((cat) => (
                        <Form.Check 
                            key={cat._id} 
                            type="checkbox" 
                            label={cat.name} 
                            checked={selectedCats.includes(cat._id)}
                            onChange={() => handleCatChange(cat._id)}
                            className="mb-2 text-secondary custom-checkbox" 
                        />
                    )) : <p className="text-muted small">Đang cập nhật...</p>
                )}
            </Accordion.Body>
        </Accordion.Item>

        {/* KHOẢNG GIÁ */}
        <Accordion.Item eventKey="1" className="border-0 mb-3">
            <Accordion.Header><span className="fw-bold">Khoảng Giá</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                <div className="d-flex flex-column gap-2">
                    {PRICE_RANGES.map((range, idx) => (
                        <Form.Check 
                            key={idx}
                            type="checkbox" // Đổi thành checkbox
                            id={`price-${idx}`}
                            label={range.label}
                            checked={selectedPrices.includes(range.value)}
                            onChange={() => handlePriceChange(range.value)}
                            className="mb-2 text-secondary custom-checkbox"
                        />
                    ))}
                </div>
            </Accordion.Body>
        </Accordion.Item>

        {/* THƯƠNG HIỆU */}
        <Accordion.Item eventKey="2" className="border-0">
            <Accordion.Header><span className="fw-bold">Thương Hiệu</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                {availableBrands.length > 0 ? availableBrands.map((brand, idx) => (
                    <Form.Check 
                        key={idx}
                        type="checkbox"
                        label={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="mb-2 text-secondary custom-checkbox"
                    />
                )) : <p className="text-muted small">Chưa có thương hiệu</p>}
            </Accordion.Body>
        </Accordion.Item>

      </Accordion>
    </div>
  );
};

export default ProductFilter;