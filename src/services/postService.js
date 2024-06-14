import axios from 'axios';
import { ip3 } from '~/utils/httpRequest';

const userId = localStorage.userId;

const getListPost = async (limit) => {
    try {
        const res = await axios.get(`${ip3}/post`, {
            params: {
                limit,
                userId,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const getListPostMyUser = async (limit, userId) => {
    try {
        const res = await axios.get(`${ip3}/post/post-myuser`, {
            params: {
                limit,
                userId,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const getOnePost = async (postId) => {
    try {
        const res = await axios.get(`${ip3}/post/${postId}`, {
            params: {
                userId
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

export { getListPost, updatePost, deletePost, postPost, getOnePost, getListPostMyUser };
