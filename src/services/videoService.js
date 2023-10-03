import * as httpRequest from '~/utils/httpRequest';

export const video = async (type = 'for-you', page = 10) => {
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
