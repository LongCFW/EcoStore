import axiosClient from "./axiosClient";

const wishlistApi = {
    getWishlist: () => {
        return axiosClient.get('/users/wishlist');
    },
    toggleWishlist: (productId) => {
        return axiosClient.post('/users/wishlist/toggle', { productId });
    }
};

export default wishlistApi;