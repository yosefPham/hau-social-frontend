import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    faCoins,
    faEarthAsia,
    faEllipsisVertical,
    faGear,
    faKeyboard,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import { Form, Input, Modal, Button as ButtonAntd, Divider, notification, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, KeyOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { getOneUser, postUser } from '~/services/loginService';
import { UserContext } from '~/context/UserContext';
import rules from '~/utils/rules';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'Tiếng Việt',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Phản hồi và trợ giúp',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];
function Header() {
    const { login, logout } = useContext(UserContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.isLoggedIn === 'true' ? true : false;
    const nickname = localStorage.nickname;
    const avatar = localStorage.avatar;
    const [currentUser, setCurrentUser] = useState(isLoggedIn);
    const [isVisible, setVisible] = useState(false);
    const [isSignUp, setSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Xem hồ sơ',
            to: `/@${nickname}`,
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Nhận xu',
            to: '/coin',
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Cài đặt',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
            separate: true,
        },
    ];

    const [api, noti] = notification.useNotification();
    const openNotification = (title, placement) => {
        api.success({
            message: title,
            placement,
        });
    };
    useEffect(() => {}, [currentUser]);
    const handleLogin = (user) => {
        console.log(user);
        setCurrentUser(true);
        login(user);
        navigate('/');
        window.location.reload();
    };
    const handleLogout = () => {
        setCurrentUser(false);
        logout();
        navigate('/search');
        window.location.reload();
    };

    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'Ngôn ngữ':
                break;
            case 'Đăng xuất':
                setVisible(true);
            default:
        }
    };

    const handleSignIn = () => {
        setSignUp(!isSignUp);
        form.resetFields();
    };

    const onFinish = async (formData) => {
        // console.log('onFinish', formData);
        setLoading(true);
        try {
            if (isSignUp) {
                if (formData.password !== formData.rePassword) {
                    message.error('Mật khẩu nhập lại không trùng khớp. Vui lòng kiểm tra lại!');
                } else {
                    const res = await postUser(formData);
                    if (res.data?.message === 'Account already exists') {
                        message.warning('Tài khoản này đã tồn tại!');
                    } else {
                        setSignUp(!isSignUp);
                        openNotification('Đăng ký thành công!', 'topRight');
                        form.resetFields();
                    }
                }
            } else {
                const res = await getOneUser(formData);
                if (res?.data?.message === 'Correct password') {
                    openNotification('Đăng nhập thành công!', 'topRight');
                    setVisible(false);
                    handleLogin(res?.data?.result[0]);
                    form.resetFields();
                } else if (res?.data?.message === 'Wrong password') {
                    message.error('Sai mật khẩu!');
                } else {
                    message.warning('Tài khoản không tồn tại!');
                }
            }
        } catch (e) {
            message.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className={cx('wrapper')}>
            {noti}
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="Tiktok" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 50]} content="Tải lên" placement="bottom">
                                <button onClick={() => navigate('/upload')} className={cx('action-btn')}>
                                    <UploadIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessageIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                    <span className={cx('badge')}>12</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setVisible(true)} text>
                                Tải lên
                            </Button>
                            <Button onClick={() => setVisible(true)} primary>
                                Đăng nhập
                            </Button>
                        </>
                    )}

                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {currentUser ? (
                            <Image className={cx('user-avatar')} src={avatar} alt="Yosef Pham" />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
            <Modal
                open={isVisible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                title={
                    !currentUser ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={images.logoShot} alt="Tiktok" className={cx('logo-shot')} />
                            <h1>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</h1>
                        </div>
                    ) : (
                        <h2 style={{ display: 'flex', justifyContent: 'center' }}>Bạn có chắc chắn muốn đăng xuất?</h2>
                    )
                }
                footer={[]}
                closable={!currentUser}
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                {currentUser ? (
                    <>
                        <div>
                            <Button
                                className={cx('button-fl')}
                                outline
                                large
                                style={{ color: '#000' }}
                                onClick={() => setVisible(false)}
                            >
                                Huỷ
                            </Button>
                            <Button className={cx('button-fl')} onClick={() => handleLogout()} outline large>
                                Đăng xuất
                            </Button>
                        </div>
                    </>
                ) : (
                    <Form
                        form={form}
                        style={{ width: '100%' }}
                        name="horizontal_login"
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item name="username" rules={[...rules.required, ...rules.email]}>
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Tên đăng nhập/Số điện thoại"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item name="password" rules={[...rules.required, ...rules.password]}>
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                size="large"
                            />
                        </Form.Item>
                        {isSignUp && (
                            <Form.Item name="rePassword" rules={[...rules.required, ...rules.password]}>
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    placeholder="Mật khẩu"
                                    iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                    size="large"
                                />
                            </Form.Item>
                        )}
                        <Form.Item shouldUpdate style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                            {() => (
                                <ButtonAntd
                                    loading={loading}
                                    type="primary"
                                    htmlType="submit"
                                    // style={{  }}
                                >
                                    {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
                                </ButtonAntd>
                            )}
                        </Form.Item>
                        <Divider style={{ margin: '10px 0 0' }} />
                        <p className={cx('question-signup')}>
                            {isSignUp ? 'Đăng nhập tại đây nhé' : 'Bạn chưa có tài khoản?'}{' '}
                            <h4 onClick={() => handleSignIn()}>{isSignUp ? 'Đăng nhập' : 'Đăng ký'}</h4>
                        </p>
                    </Form>
                )}
            </Modal>
        </header>
    );
}

export default Header;
