import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart'; 

const AddToCartBtn = ({ productId, quantity = 1, className = "", variant = "success", size = "md", showIcon = true, disabled = false, children }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault(); // Ngăn chặn link nếu đặt trong thẻ Link
        e.stopPropagation();
        
        setIsAdding(true);
        await addToCart(productId, quantity);
        setIsAdding(false);
    };

    return (
        <Button 
            variant={variant} 
            size={size} 
            className={className} 
            onClick={handleClick}
            disabled={isAdding || disabled}
        >
            {isAdding ? (
                <FaSpinner className="fa-spin me-2" />
            ) : (
                showIcon && <FaShoppingCart className="me-2" />
            )}
            {children || (isAdding ? "Đang thêm..." : "Thêm vào giỏ")}
        </Button>
    );
};

export default AddToCartBtn;