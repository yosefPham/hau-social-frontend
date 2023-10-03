import axios from 'axios';
import { ip3 } from '~/utils/httpRequest';

const userId = localStorage.userId;

const getListPost = async (page, limit) => {
    try {
        const res = await axios.get(`${ip3}/post`, {
            params: {
                page,
                limit,
                userId,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const postPost = async (body) => {
    try {
        const res = await axios.post(`${ip3}/post`, body);
        return res;
    } catch (error) {
        console.log(error);
    }
};

const updatePost = async (id, body) => {
    try {
        const response = await axios.put(`${ip3}/post/${id}`, body);
        return response;
    } catch (error) {
        console.log('error', error);
    }
};
const deletePost = async (id) => {
    try {
        const res = await axios.delete(`${ip3}/post/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getListPost, updatePost, deletePost, postPost };
