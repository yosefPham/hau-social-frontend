import * as httpRequest from '~/utils/httpRequest';

export const video = async (type = 'following', page = 1) => {
    try {
        const res = await httpRequest.get('videos', {
            params: {
                type,
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
