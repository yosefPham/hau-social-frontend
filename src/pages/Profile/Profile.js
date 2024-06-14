import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { EditOutlined, LockOutlined, ShareAltOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Form, Input, message, Modal, Row, Tabs, Upload } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { getUser, updateUser } from '~/services/userServive';
import styles from './Profile.module.scss';
import Image from '~/components/Image';
import TabPane from 'antd/es/tabs/TabPane';
import Video from '~/components/Video/Video';
import { UserContext } from '~/context/UserContext';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMusic } from '@fortawesome/free-solid-svg-icons';

import * as videoService from '~/services/videoService';
import ItemRender from '~/components/Render';
import { getListPostMyUser } from '~/services/postService';
import { Skeleton } from 'antd';
const cx = classNames.bind(styles);

function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location?.state?.userId;
    const [form] = Form.useForm();
    const myProfile = id ? false : true;
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [image, setImage] = useState();
    const [nickname, setNickname] = useState('');
    const { handleFollow } = useContext(UserContext);
    const [status, setStatus] = useState('Follow');
    const [suggestedUser, setSuggestedUser] = useState([]);
    const [limit, setLimit] = useState(7);
    const [total, setTotal] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const handleTogglePlay = (videoIndex) => {
        if (isPlaying && currentVideoIndex === videoIndex) {
            setIsPlaying(false);
            setCurrentVideoIndex(null);
        } else {
            setIsPlaying(true);
            setCurrentVideoIndex(videoIndex);
        }
    };
    useEffect(() => {
        getDataUser();
        getInitData();
    }, [id]);

    useEffect(() => {
        getMoreData();
    }, [limit]);
    const handleUserFollow = async (id) => {
        if (status === 'Tin nhắn') {
            navigate(`/`);
        } else {
            if (localStorage.userId) {
                const res = await handleFollow(id, status);
                if (res?.data?.status === 200) {
                    getDataUser();
                }
            } else {
                message.warning("Vui lòng đăng nhập để thực hiện hành động này!")
            }
        }
    };
    const getDataUser = async () => {
        const res = await getUser(location?.state?.userId ?? localStorage.userId, localStorage.userId);
        setNickname(res?.data?.result?.nickname);
        setImage(res?.data?.result?.avatar);
        setStatus(
            res?.data?.result?.status === 'isFollower'
                ? 'Follow'
                : res?.data?.result?.status === 'isFollowing'
                ? 'Unfollow'
                : res?.data?.result?.status === 'isFriend'
                ? 'Tin nhắn'
                : 'Follow',
        );
        setUser(res?.data?.result);
        form.setFieldsValue(res?.data?.result);
    };
    const onFinish = async (formData) => {
        setLoading(true);
        formData.avatar = image;
        console.log(formData);
        try {
            const res = await updateUser(user?._id, formData);
            if (res?.data?.status === 200) {
                message.success('Cập nhật thành công');
                getDataUser();
                setVisibleModal(false);
            }
        } catch (e) {
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
            if (isBottom && !isLoading) {
                setLimit(limit + 7)
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading]);

    const getInitData = async () => {
        setIsLoading(true)
        try {
            const res = await getListPostMyUser(limit, location?.state?.userId ?? localStorage.userId);
            setTotal(res?.data?.total)
            setSuggestedUser(res?.data?.result);
            if (res?.data?.result?.length < limit) {
                setIsOver(true)
            }
        } catch (err) {

        } finally {
            setIsLoading(false);
        }
    };

    const getMoreData = async () => {
        setIsLoading(true)
        try {
            if (!isOver) {
                const res = await getListPostMyUser(limit, location?.state?.userId ?? localStorage.userId);
                setTotal(res?.data?.total)
                setSuggestedUser(res?.data?.result);
                if (res?.data?.result?.length < limit) {
                    setIsOver(true)
                }
            }
        } catch (err) {

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <aside className={cx('wrapper')}>
            <div className={cx('user-profile')}>
                <div className={cx('header-user-profile')}>
                    <div className={cx('header-profile')}>
                        <Image src={user?.avatar} size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 120, xxl: 100 }} />
                        <div className={cx('header-profile-name')}>
                            <h1>{user?.nickname}</h1>
                            <h4>{user?.fullname}</h4>
                            {myProfile ? (
                                <Button icon={<EditOutlined />} type="default" onClick={() => setVisibleModal(true)}>
                                    Sửa hồ sơ
                                </Button>
                            ) : (
                                <Button
                                    type={status === 'Follow' ? 'primary' : 'default'}
                                    onClick={() => handleUserFollow(user?._id)}
                                >
                                    {status}
                                </Button>
                            )}
                        </div>
                    </div>
                    <ShareAltOutlined style={{ fontSize: '2.4rem' }} />
                </div>
                <div className={cx('user-count')}>
                    <p>
                        <h4>{user?.followings?.length ?? 0}</h4> Đang Follow
                    </p>
                    <p>
                        <h4>{user?.followers?.length ?? 0}</h4> Follower
                    </p>
                    <p>
                        <h4>{user?.likes?.length ?? 0}</h4> Thích
                    </p>
                </div>
                <p className={cx('bio')}>{user?.bio}</p>
            </div>
            <Tabs centered defaultActiveKey="0" onTabClick={() => setIsPlaying(false)}>
                <TabPane tab={<p>Bài đăng</p>} key="0">
                    {suggestedUser?.map((data) => {
                        return (
                            <div key={data.id} className={cx('account-item')}>
                                <div className={cx('user')}>
                                    <div className={cx('user-post-account')}>
                                        <div className={cx('user-body')}>
                                            <div className={cx('user-info')}>
                                                <Image
                                                    src={data?.userId?.avatar}
                                                    size={'large'}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <p className={cx('nickname')}>
                                                    <strong>{data?.userId?.nickname}</strong>
                                                    {data?.userId?.tick && (
                                                        <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                                    )}
                                                </p>
                                                <p className={cx('name')}>{data?.userId?.fullname}</p>
                                            </div>
                                            <div className={cx('information')}>
                                                <span>{data?.description}</span>
                                            </div>
                                            {data?.music && (
                                                <h4 className={cx('music-name')}>
                                                    <FontAwesomeIcon className={cx('icon-music')} icon={faMusic} />
                                                    <a href="">{data?.music}</a>
                                                </h4>
                                            )}
                                        </div>
                                    </div>
                                    <ItemRender data={data} getInitData={getInitData}/>
                                </div>
                            </div>
                        );
                    })}
                    {suggestedUser?.length  === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có bài đăng nào" />}
                    {!isOver && <Skeleton active={isLoading} style={{width: "60%", marginTop: '20px'}} />}
                </TabPane>
            </Tabs>
            <Modal
                width={700}
                title={<h2 style={{ fontWeight: 600 }}>Sửa hồ sơ</h2>}
                footer={<></>}
                open={isVisibleModal}
                onCancel={() => setVisibleModal(false)}
            >
                <Form
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    form={form}
                    layout="horizontal"
                >
                    <Divider />
                    <Form.Item
                        label={<h3 style={{ fontWeight: 600 }}>Avatar</h3>}
                        name="avatar"
                        className={cx('form-item')}
                        colon={false}
                        // wrapperCol={}
                    >
                        <Upload
                            multiple={false}
                            showUploadList={false}
                            style={{ width: '160%' }}
                            action="http://localhost:8001/upload"
                            listType="picture-card"
                            name="myFiles"
                            method="POST"
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    setImage(info.file.response?.result);
                                }
                            }}
                        >
                            {image ? (
                                <img src={image} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label={<h3 style={{ fontWeight: 600 }}>HTok id</h3>}
                        name="nickname"
                        className={cx('form-item')}
                        colon={false}
                    >
                        <Input className={cx('input')} size="large" onChange={(e) => setNickname(e.target.value)} />
                    </Form.Item>
                    <Form.Item colon={false} label={' '}>
                        <p className={cx('text-note')}>www.htok.com/@{nickname}</p>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label={<h3 style={{ fontWeight: 600 }}>Tên</h3>}
                        name="fullname"
                        className={cx('form-item')}
                        colon={false}
                    >
                        <Input className={cx('input')} size="large" />
                    </Form.Item>
                    <Form.Item colon={false} label={' '}>
                        <p className={cx('text-note')}>Bạn chỉ có thể đổi biệt danh 7 ngày một lần</p>
                    </Form.Item>
                    <Divider />
                    <Form.Item colon={false} name="bio" label={<h3 style={{ fontWeight: 600 }}>Tiểu sử</h3>}>
                        <Input.TextArea className={cx('input')} size="large" />
                    </Form.Item>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="default" style={{ marginRight: '1rem' }} onClick={() => setVisibleModal(false)}>
                            Huỷ bỏ
                        </Button>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Lưu lại
                        </Button>
                    </div>
                </Form>
            </Modal>
        </aside>
    );
}

export default Profile;
