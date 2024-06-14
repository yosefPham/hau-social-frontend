import { useState, useContext, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots, faShare, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './Render.module.scss';
import ReactPlayer from 'react-player';
import { NavLink, useLocation } from 'react-router-dom';
import { Image, message } from 'antd';
import { UserContext } from '~/context/UserContext';

const cx = classNames.bind(styles);
const ItemRender = ({ data, getInitData }) => {
    const { handleLikePost } = useContext(UserContext);
    const [play, setPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLike, setIsLike] = useState(data?.isLike)
    const [type, setType] = useState('image')
    const handleProgress = (progress) => {
        const { playedSeconds } = progress;
        setCurrentTime(playedSeconds);
    };
    const handlePlay = () => {
        if (!play) {
            setPlay(true);
        } else {
            setPlay(false);
        }
    };

    useEffect(() => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
        const videoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".wmv"];

        // Trích xuất phần mở rộng từ URL
        const extension = data?.fileList[0].substring(data?.fileList[0].lastIndexOf("."));

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
                getInitData();
            }
        } else {
            message.warning("Vui lòng đăng nhập để thực hiện hành động này!")
        }
    };
    return (
        <div className={cx('user-video')}>
            <div onClick={handlePlay} className={cx('video')}>
                {type === 'video' ? (
                    <>
                        <ReactPlayer
                            className="video"
                            poster={data?.fileList[0]}
                            url={data?.fileList[0]}
                            width="100%"
                            height="100%"
                            playing={play}
                            onProgress={handleProgress}
                            loop
                        />
                        <div className={cx('button-play')}>
                            {!play && (
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className={cx('button-icon-play')}
                                    onClick={handlePlay}
                                />
                            )}
                            {play && (
                                <FontAwesomeIcon
                                    icon={faPause}
                                    className={cx('button-icon-play')}
                                    onClick={handlePlay}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <Image src={data?.fileList[0]} />
                )}
            </div>
            <div className={cx('interact')}>
                <div className={cx('type')} onClick={() => handleUserLike(data?._id)}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon className={cx('icon-interact', isLike && 'isActive')} icon={faHeart} />
                    </div>
                    <p>{data?.likes?.length ?? 0}</p>
                </div>
                <NavLink
                    className={cx('type')}
                    to={`/@${data?.userId?.nickname}/video/${data?._id}`}
                    state={{ data: data, currentTime: currentTime }}
                >
                    <div className={cx('icon')}>
                        <FontAwesomeIcon className={cx('icon-interact')} icon={faCommentDots} />
                    </div>
                    <p>{data?.commentsCount ?? 0}</p>
                </NavLink>
                <div className={cx('type')}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon className={cx('icon-interact')} icon={faShare} />
                    </div>
                    <p>{data.sharesCount ?? 0}</p>
                </div>
            </div>
        </div>
    );
};

export default ItemRender;
