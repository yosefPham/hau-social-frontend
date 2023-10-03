import React, { useEffect, useState, useContext } from 'react';
// import sizeOf from 'image-size';
import { HeartOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHeart, faCommentDots, faShare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Tabs, Input, Divider, Image, Carousel, Space, Button } from 'antd';
import classNames from 'classnames/bind';

import styles from './Detail.module.scss';
import AccountView from '~/components/AccountView/AccountView';
import Video from '~/components/Video/Video';
import { getListComment, postComment } from '~/services/commentService';
import { UserContext } from '~/context/UserContext';
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
    const now = new Date();

    console.log('data', data);
    useEffect(() => {
        getInitDataComment();
    }, []);
    const goBack = () => {
        navigate(-1);
    };

    const handleUserLike = async (postId, type) => {
        const res = await handleLikePost(postId, localStorage.userId, type);
        if (res?.data?.status === 200) {
            // getDataUser();
        }
    };

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
    const handleClick = async () => {
        setLoading(true);
        try {
            const body = {
                description: valueComment,
                userId: localStorage.userId,
                postId: data?._id,
            };
            const res = await postComment(body);
            if (res?.data?.status === 201) {
                getInitDataComment();
                setValueComment('');
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };
    const getInitDataComment = async () => {
        const response = await getListComment(1, 7, data?._id);
        console.log('response', response);
        setListComment(response?.data?.result);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('render-video')}>
                <div className={cx('back-navigate')} onClick={() => goBack()}>
                    <FontAwesomeIcon icon={faXmark} className={cx('button-back')} />
                </div>
                {dataPost?.type === 'video' ? (
                    <Video data={dataPost} playing={true} currentTime={currentTime} />
                ) : (
                    <div style={{ width: '100%' }}>
                        <Carousel className="ant-carousel" afterChange={onChange} style={{ width: '100%' }}>
                            {dataPost?.fileList?.map((url) => {
                                isVertical(url);
                                return <Image src={url} preview={false} />;
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
                            <FontAwesomeIcon className={cx('icon-interact')} icon={faHeart} />
                        </div>
                        <p className={cx('info')}>{dataPost.likes?.length ?? 0}</p>
                    </div>
                    <NavLink
                        className={cx('type')}
                        to={`/@${dataPost?.user?.nickname}/video/${dataPost?.id}`}
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
                                if (days > 1) {
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
                            <Button loading={loading} type="primary" onClick={handleClick}>
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
