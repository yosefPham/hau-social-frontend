import React, { useEffect, useState, useContext, useRef } from 'react';
// import sizeOf from 'image-size';
import { HeartOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHeart, faCommentDots, faShare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Tabs, Input, Divider, Image, Carousel, Space, Button, message } from 'antd';
import classNames from 'classnames/bind';

import styles from './Detail.module.scss';
import AccountView from '~/components/AccountView/AccountView';
import Video from '~/components/Video/Video';
import { getListComment, postComment } from '~/services/commentService';
import { UserContext } from '~/context/UserContext';
import { getOnePost } from '~/services/postService';
import ImageComponent from '~/components/RenderImage';
const cx = classNames.bind(styles);

const Detail = () => {
    const { handleLikePost } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [valueComment, setValueComment] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { data, currentTime } = location.state;
    const [dataPost, setDataPost] = useState(data);
    const [listComment, setListComment] = useState();
    const [isLike, setIsLike] = useState(data?.isLike);
    const [type, setType] = useState('image')
    const now = new Date();

    useEffect(() => {
        getInitDataComment();
    }, [dataPost]);
    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
        const videoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".wmv"];

        // Trích xuất phần mở rộng từ URL
        const extension = dataPost?.fileList[0].substring(data?.fileList[0].lastIndexOf("."));

        // Kiểm tra xem phần mở rộng có tồn tại trong danh sách đuôi tệp ảnh hay video không
        if (videoExtensions.includes(extension)) {
            return setType('video');
        } else {
            return setType('image');
        }
    }, [])

    const handleUserLike = async (postId) => {
        if (localStorage.userId) {
            const res = await handleLikePost(postId, localStorage.userId, { isLike: !isLike});
            if (res?.data?.status === 200) {
                setIsLike(!isLike)
                getDataPost();
            }
        } else {
            message.warning("Vui lòng đăng nhập để thực hiện hành động này!")
        }
    };

    const getDataPost = async () => {
        const res = await getOnePost(data?._id)
        setDataPost(res?.data?.result[0])
    }

    const onChange = (currentSlide) => {
        console.log(currentSlide);
    };

    const handleChangeInput = (event) => {
        setValueComment(event.target.value);
    };

    const isVertical = (url) => {
        const image = React.createElement(Image, { src: url });
        console.log('image', image);
        // return image.ratio() > 1;
    };
    const handlePostComment = async () => {
        setLoading(true);
        try {
            const body = {
                description: valueComment,
                userId: localStorage.userId,
                postId: data?._id,
            };
            if (localStorage.userId) {
                const res = await postComment(body);
                if (res?.data?.status === 201) {
                    getInitDataComment();
                    getDataPost();
                    setValueComment('');
                }
            } else {
                message.warning("Vui lòng đăng nhập để thực hiện hành động này!")
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };
    const getInitDataComment = async () => {
        const response = await getListComment(1, 7, data?._id);
        setListComment(response?.data?.result);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('render-video')}>
                <div className={cx('back-navigate')} onClick={() => goBack()}>
                    <FontAwesomeIcon icon={faXmark} className={cx('button-back')} />
                </div>
                {type === 'video' ? (
                    <Video data={dataPost} playing={true} currentTime={currentTime} />
                ) : (
                    <div style={{ width: '100%' }}>
                        <Carousel 
                            className="ant-carousel" 
                            afterChange={onChange} 
                            style={{ 
                                width: '100%', 
                                height: '715px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center'
                            }}
                        >
                            {dataPost?.fileList?.map((url) => {
                                isVertical(url);
                                return <div className={cx('image')}>
                                    <ImageComponent src={url}/>
                                </div>;
                            })}
                        </Carousel>
                    </div>
                )}
            </div>
            <div className={cx('interact')}>
                <AccountView
                    data={dataPost}
                    style={{
                        padding: '15px',
                        borderRadius: '10px',
                        background: 'var(--default-background-color)',
                    }}
                />
                <div className={cx('icons')}>
                    <div className={cx('type')} onClick={() => handleUserLike(dataPost?._id)}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon className={cx('icon-interact', isLike && 'isActive')} icon={faHeart} />
                        </div>
                        <p className={cx('info')}>{dataPost.likes?.length ?? 0}</p>
                    </div>
                    <NavLink
                        className={cx('type')}
                        to={`/@${dataPost?.userId?.nickname}/video/${dataPost?._id}`}
                        state={dataPost}
                    >
                        <div className={cx('icon')}>
                            <FontAwesomeIcon className={cx('icon-interact')} icon={faCommentDots} />
                        </div>
                        <p className={cx('info')}>{dataPost?.commentsCount ?? 0}</p>
                    </NavLink>
                    <div className={cx('type')}>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon className={cx('icon-interact')} icon={faShare} />
                        </div>
                        <p className={cx('info')}>{dataPost?.sharesCount ?? 0}</p>
                    </div>
                </div>
                <Tabs defaultActiveKey="0" tabBarGutter={60} centered={false}>
                    <TabPane tab="Bình luận" key="0">
                        <div className={cx('comment')}>
                            {listComment?.map((dataComment, index) => {
                                let time = '';
                                const targetTime = new Date(dataComment?.createdAt);
                                const newTime = now - targetTime;
                                const seconds = Math.floor(newTime / 1000);
                                const minutes = Math.floor(seconds / 60);
                                const hours = Math.floor(minutes / 60);
                                const days = Math.floor(hours / 24);
                                if (days >= 1) {
                                    time = `${days} ngày trước`;
                                } else if (hours > 1) {
                                    time = `${hours} giờ trước`;
                                } else if (minutes > 1) {
                                    time = `${minutes} phút trước`;
                                } else if (seconds > 1) {
                                    time = `${seconds} giây trước`;
                                }
                                return (
                                    <div key={index} className={cx('account-comment')}>
                                        <Avatar src={dataComment?.userId?.avatar} size="large" />
                                        <div className={cx('user')}>
                                            <div className={cx('user-account')}>
                                                <div className={cx('user-info')}>
                                                    <p className={cx('nickname')}>
                                                        <strong>{dataComment?.userId?.fullname}</strong>
                                                        {dataComment?.userId?.tick && (
                                                            <FontAwesomeIcon
                                                                className={cx('check')}
                                                                icon={faCheckCircle}
                                                            />
                                                        )}
                                                    </p>
                                                    <p className={cx('content')}>{dataComment?.description}</p>
                                                    <p className={cx('time-created')}>{time}</p>
                                                </div>
                                            </div>
                                            <div className={cx('like-quantity')}>
                                                <HeartOutlined />
                                                <p>{dataComment?.likes?.length ?? 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Divider style={{ margin: '13px' }} />
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Thêm bình luận..."
                                style={{ backgroundColor: 'var(--default-background-color)' }}
                                bordered={false}
                                value={valueComment}
                                onChange={handleChangeInput}
                            />
                            <Button loading={loading} type="primary" onClick={handlePostComment}>
                                Đăng
                            </Button>
                        </Space.Compact>
                    </TabPane>
                    {/* <TabPane tab="Video của nhà sáng tạo" key="1"></TabPane> */}
                </Tabs>
            </div>
        </div>
    );
};

export default Detail;
