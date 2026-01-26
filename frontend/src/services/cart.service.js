import axiosClient from "./axiosClient";

const cartApi = {
    getCart: () => {
        return axiosClient.get('/cart');
    },
    addToCart: (data) => {
        // data: { productId, quantity }
        return axiosClient.post('/cart/add', data);
    },
    updateQuantity: (data) => {
        // data: { productId, quantity }
        return axiosClient.put('/cart/update', data);
    },
    removeItem: (productId) => {
        return axiosClient.delete(`/cart/remove/${productId}`);
    }
};

export default cartApi;