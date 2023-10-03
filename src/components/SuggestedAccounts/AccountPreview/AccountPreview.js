import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './AccountPreview.module.scss';
import Image from '~/components/Image';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
const cx = classNames.bind(styles);

function AccountPreview({ data, handleFollow }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Follow');
    useEffect(() => {
        setStatus(
            data?.status === 'isFollower'
                ? 'Follow'
                : data?.status === 'isFollowing'
                ? 'Unfollow'
                : data?.status === 'isFriend'
                ? 'Tin nhắn'
                : 'Follow',
        );
    }, [data]);
    const handleClick = () => {
        if (status === 'Tin nhắn') {
            navigate(`/`);
        } else {
            handleFollow(data?._id, status);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Image className={cx('avatar')} src={data.avatar} alt="" />
                <Button type={status === 'Follow' ? 'primary' : 'default'} onClick={handleClick}>
                    {status}
                </Button>
            </div>
            <div className={cx('body')}>
                <p className={cx('nickname')}>
                    <strong onClick={() => navigate(`/@${data?.nickname}`, { state: { userId: data?._id } })}>
                        {data.nickname}
                    </strong>
                    {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                </p>
                <p className={cx('name')}>{`${data.fullname}`}</p>
                <p className={cx('analytics')}>
                    <strong className={cx('value')}>{data?.followers?.length ?? 0}</strong>
                    <span className={cx('label')}> Followers</span>
                    <strong className={cx('value')}>{data?.likes?.length ?? 0}</strong>
                    <span className={cx('label')}> Likes</span>
                </p>
            </div>
        </div>
    );
}

export default AccountPreview;
