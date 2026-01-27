import axiosClient from "./axiosClient";

const contactApi = {
    sendContact: (data) => {
        return axiosClient.post('/contact', data);
    }
};

export default contactApi;