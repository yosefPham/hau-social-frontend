import classNames from 'classnames/bind';
import 'tippy.js/dist/tippy.css';

import styles from './Upload.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import { useEffect, useState } from 'react';
import { Form, Input, Modal, Button, Upload as UploadVideo, notification, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postPost, updatePost } from '~/services/postService';
import { ip3 } from '~/utils/httpRequest';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Upload = () => {
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const onFinish = async (formData) => {
        setLoading(true);
        try {
            const listImages = [];
            formData?.fileList?.fileList?.map((res) => {
                listImages.push(res?.response?.result);
            });
            formData.fileList = listImages;
            formData.userId = localStorage.userId;
            const result = await postPost(formData);
            if (result?.data?.status === 201) {
                message.success('Tạo bài viết thành công');
                navigate(`/@${localStorage.nickname}`);
            }
            console.log(result);
        } catch (e) {
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-upload')}>
                <Form onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="vertical">
                    <Row
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'column',
                            marginBottom: '30px',
                        }}
                    >
                        <Col span={18} push={4}>
                            <h1>Tạo bài viết</h1>
                            <p>Đăng bài viết vào tài khoản của bạn</p>
                        </Col>
                    </Row>
                    <Form.Item name="fileList">
                        <UploadVideo
                            multiple={false}
                            style={{ width: '160%' }}
                            action={`${ip3}/upload`}
                            listType="picture-card"
                            name="myFiles"
                            method="POST"
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        </UploadVideo>
                    </Form.Item>
                    <Form.Item label={<h3>Nội dung</h3>} name="description">
                        <TextArea />
                    </Form.Item>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            marginTop: '50px',
                        }}
                    >
                        <Button
                            loading={loading}
                            style={{ marginRight: '5px' }}
                            type="default"
                            htmlType="button"
                            size="large"
                        >
                            Huỷ bỏ
                        </Button>
                        <Button type="primary" htmlType="submit" size="large">
                            Đăng tải
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Upload;
