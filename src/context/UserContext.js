import React from 'react';
import { updatePost } from '~/services/postService';
import { getUser, followUser, getListUser } from '~/services/userServive';
const UserContext = React.createContext({ id: '', auth: false, user: {} });

const UserProvider = ({ children }) => {
    const userId = localStorage.userId;
    const [user, setUser] = React.useState({ id: '', auth: false, user: {} });
    const login = (user) => {
        setUser(() => ({
            id: user?._id,
            auth: true,
            user: user,
        }));
        localStorage.isLoggedIn = 'true';
        localStorage.userId = user?._id;
        localStorage.nickname = user?.nickname;
        localStorage.avatar = user?.avatar;
    };

    const logout = () => {
        setUser(() => ({
            id: '',
            auth: false,
            user: {},
        }));
        localStorage.isLoggedIn = 'false';
        localStorage.removeItem('userId');
        localStorage.removeItem('nickname');
        localStorage.removeItem('avatar');
    };
    const handleFollow = async (id, type) => {
        const body = {
            followings: {
                userId: id,
                type: type,
            },
        };
        console.log(body);
        const res = await followUser(userId, body);
        return res;
    };

    const handleLikePost = async (postId, userId, type) => {
        const body = {
            likes: {
                userId: userId,
                type: type,
            },
        };
        console.log(body);
        const res = await updatePost(postId, body);
        return res;
    };

    return (
        <UserContext.Provider value={{ user, login, logout, handleFollow, handleLikePost }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
