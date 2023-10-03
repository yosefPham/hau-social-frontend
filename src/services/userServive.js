import axios from 'axios';
import * as httpRequest from '~/utils/httpRequest';
import { ip3 } from '~/utils/httpRequest';

const userId = localStorage.userId;
const getsuggested = async (page, perPage) => {
    try {
        const res = await httpRequest.get('users/suggested', {
            params: {
                page,
                per_page: perPage,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const getListUser = async (page, limit) => {
    try {
        const res = await axios.get(`${ip3}/user`, {
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

const getUser = async (id, idSignIn) => {
    try {
        const res = await axios.get(`${ip3}/user/${id}`, {
            params: {
                id: idSignIn,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async (id, body) => {
    try {
        const response = await axios.put(`${ip3}/user/${id}`, body);
        return response;
    } catch (error) {
        console.log('error', error);
    }
};
const deleteUser = async (id) => {
    try {
        const res = await axios.delete(`${ip3}/user/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
const followUser = async (id, body) => {
    try {
        const response = await axios.put(`${ip3}/user/follow/${id}`, body);
        return response;
    } catch (error) {
        console.log('error', error);
    }
};

export { getsuggested, getUser, updateUser, deleteUser, getListUser, followUser };
