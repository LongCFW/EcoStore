import React, { useState } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { FaFilter, FaRedo } from 'react-icons/fa';

const PRICE_RANGES = [
    { label: "Dưới 100k", value: "0-100000" },
    { label: "100k - 300k", value: "100000-300000" },
    { label: "300k - 500k", value: "300000-500000" },
    { label: "Trên 500k", value: "500000-999999999" }
];

const ProductFilter = ({ onFilter, onReset, availableBrands = [], initialFilters }) => {

  // --- STATE (Khởi tạo trực tiếp từ props, dẹp bỏ useEffect copy state) ---
  const [selectedBrands, setSelectedBrands] = useState(() => initialFilters?.brands || []);
  const [selectedPrices, setSelectedPrices] = useState(() => initialFilters?.priceRanges || []); 

  // --- LOGIC GỬI DỮ LIỆU ---
  const triggerFilter = (newBrands, newPrices) => {
      onFilter({
          categoryIds: [], // Category giờ xử lý trên URL, nên để trống
          brands: newBrands ?? selectedBrands,
          priceRanges: newPrices ?? selectedPrices 
      });
  };

  const handleBrandChange = (brandName) => {
      const newBrands = selectedBrands.includes(brandName) 
          ? selectedBrands.filter(b => b !== brandName) 
          : [...selectedBrands, brandName];
      setSelectedBrands(newBrands);
      triggerFilter(newBrands, null);
  };

  const handlePriceChange = (rangeValue) => {
      const newPrices = selectedPrices.includes(rangeValue)
          ? selectedPrices.filter(p => p !== rangeValue) 
          : [...selectedPrices, rangeValue]; 
      
      setSelectedPrices(newPrices);
      triggerFilter(null, newPrices);
  };

  const handleResetFilter = () => {
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
        <Button variant="link" size="sm" className="text-danger fw-bold text-decoration-none p-0" onClick={handleResetFilter}>
            <FaRedo className="me-1"/> Reset
        </Button>
      </div>

      <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
        
        {/* ĐÁNH GIÁ (GIỮ CHỖ) */}
        <Accordion.Item eventKey="0" className="border-0 mb-3">
            <Accordion.Header><span className="fw-bold">Đánh giá</span></Accordion.Header>
            <Accordion.Body className="px-0 pt-2">
                <p className="text-muted small">Tính năng đang cập nhật...</p>
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
                            type="checkbox"
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