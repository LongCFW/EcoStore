import React, { useState, useEffect, useCallback} from 'react';
import wishlistApi from '../services/wishlist.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { WishlistContext } from './WishlistContext';

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    
    // State
    const [wishlist, setWishlist] = useState([]); 
    const [wishlistIds, setWishlistIds] = useState([]); 

    // --- 1. Ổn định User ID (Primitive type) ---
    // Chỉ lấy chuỗi ID hoặc null. Tránh dùng object user làm dependency.
    const userId = user?._id || user?.id || null;

    // --- 2. EFFECT QUẢN LÝ VIỆC TẢI DỮ LIỆU TỰ ĐỘNG ---
    // Logic tải dữ liệu nằm HOÀN TOÀN bên trong useEffect.
    // Không gọi hàm bên ngoài để tránh lỗi Cascading Render.
    useEffect(() => {
        let isMounted = true; // Cờ kiểm soát component còn tồn tại không

        const initializeWishlist = async () => {
            if (!userId) {
                if (isMounted) {
                    setWishlist([]);
                    setWishlistIds([]);
                }
                return;
            }

            try {
                const res = await wishlistApi.getWishlist();
                if (isMounted && res.success) {
                    setWishlist(res.data);
                    // Map ra ID để check nhanh
                    setWishlistIds(res.data.map(item => item._id));
                }
            } catch (error) {
                console.error("Lỗi khởi tạo wishlist:", error);
            }
        };

        initializeWishlist();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [userId]); // Dependency duy nhất là userId (chuỗi). Cực kỳ an toàn.

    // --- 3. HÀM FETCH THỦ CÔNG (Dùng để export ra Context) ---
    // Hàm này độc lập với useEffect, dùng khi muốn refresh bằng tay (nếu cần)
    const fetchWishlist = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await wishlistApi.getWishlist();
            if (res.success) {
                setWishlist(res.data);
                setWishlistIds(res.data.map(item => item._id));
            }
        } catch (error) {
            console.error("Lỗi refresh wishlist:", error);
        }
    }, [userId]);

    // --- 4. HÀM TOGGLE (THÊM/XÓA) ---
    const toggleWishlist = useCallback(async (product) => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập để yêu thích!");
            return;
        }

        const productId = product._id || product.id;
        const isExist = wishlistIds.includes(productId);
        
        // Optimistic UI Update: Cập nhật giao diện trước cho mượt
        if (isExist) {
            setWishlistIds(prev => prev.filter(id => id !== productId));
            setWishlist(prev => prev.filter(item => item._id !== productId));
            toast.success("Đã xóa khỏi yêu thích");
        } else {
            setWishlistIds(prev => [...prev, productId]);
            setWishlist(prev => [...prev, product]); 
            toast.success("Đã thêm vào yêu thích");
        }

        // Gọi API ngầm
        try {
            await wishlistApi.toggleWishlist(productId);
            // Không cần fetch lại ngay để tránh giật lag giao diện
        } catch (error) {
            console.error("Lỗi toggle API:", error);
            toast.error("Lỗi kết nối server");
            // Nếu lỗi thì gọi hàm fetch thủ công để đồng bộ lại dữ liệu đúng
            fetchWishlist(); 
        }
    }, [userId, wishlistIds, fetchWishlist]);

    // Helper function
    const isInWishlist = (productId) => {
        return wishlistIds.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};