import axios from 'axios';
import { ip3 } from '~/utils/httpRequest';

const userId = localStorage.userId;

const getListComment = async (page, limit, postId) => {
    try {
        const res = await axios.get(`${ip3}/comment`, {
            params: {
                page,
                limit,
                postId,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const postComment = async (body) => {
    try {
        const res = await axios.post(`${ip3}/comment`, body);
        return res;
    } catch (error) {
        console.log(error);
    }
};

const updateComment = async (id, body) => {
    try {
        const response = await axios.put(`${ip3}/comment/${id}`, body);
        return response;
    } catch (error) {
        console.log('error', error);
    }
};
const deleteComment = async (id) => {
    try {
        const res = await axios.delete(`${ip3}/comment/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getListComment, updateComment, deleteComment, postComment };
