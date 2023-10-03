import axios from 'axios';
import { ip3 } from '~/utils/httpRequest';

const getOneUser = async (payload) => {
    const { username, password } = payload;
    try {
        const res = await axios.get(`${ip3}/user/login`, {
            params: {
                username,
                password,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const postUser = async (payload) => {
    try {
        const res = await axios.post(`${ip3}/user`, payload);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getOneUser, postUser };
