import axiosClient from "./axiosClient";

const orderApi = {
    createOrder: (data) => {
        // data: { shippingAddress, phoneNumber, note, paymentMethod }
        return axiosClient.post('/orders', data);
    },
    getMyOrders: () => {
        return axiosClient.get('/orders');
    }
};

export default orderApi; // <--- Dòng này quan trọng để fix lỗi import default