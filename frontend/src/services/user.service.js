import axiosClient from "./axiosClient";

const userApi = {
    // Lấy thông tin user mới nhất (để cập nhật lại Context sau khi thêm/sửa/xóa)
    getProfile: () => axiosClient.get('/auth/me'),

    adminUpdateUser: (userId, data) => axiosClient.put(`/users/${userId}/admin-update`, data),
    deleteUser: (userId) => axiosClient.delete(`/users/${userId}`),
    // --- API ĐỊA CHỈ ---
    // POST /api/users/address
    addAddress: (data) => axiosClient.post('/users/address', data),

    // PUT /api/users/address/:addressId
    updateAddress: (addressId, data) => axiosClient.put(`/users/address/${addressId}`, data),

    // DELETE /api/users/address/:addressId
    deleteAddress: (addressId) => axiosClient.delete(`/users/address/${addressId}`),

    // PUT /api/users/address/:addressId/default
    setDefaultAddress: (addressId) => axiosClient.put(`/users/address/${addressId}/default`),

    // API tạo nhân viên:
    createStaff: (data) => axiosClient.post('/users/staff', data),
};

export default userApi;