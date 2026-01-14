import axiosClient from './axiosClient';

const categoryApi = {
  getAll: () => {
    return axiosClient.get('/categories');
    // URL sẽ là: http://localhost:5000/api/categories
  }
};

export default categoryApi;