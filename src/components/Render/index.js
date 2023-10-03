import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots, faShare, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './Render.module.scss';
import ReactPlayer from 'react-player';
import { NavLink, useLocation } from 'react-router-dom';
import config from '~/config';
import { Carousel, Image } from 'antd';
const cx = classNames.bind(styles);
const contentStyle = {
    // height: '160px',
    // width: '10%',
    // color: '#fff',
    // lineHeight: '160px',
    // textAlign: 'center',
    // background: '#364d79',
};
const ItemRender = ({ data }) => {
    const [play, setPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

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
    return (
        <div className={cx('user-video')}>
            <div onClick={handlePlay} className={cx('video')}>
                {data?.type === 'video' ? (
                    <>
                        <ReactPlayer
                            className="video"
                            poster={data.thumb_url}
                            url={data.file_url}
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
                <div className={cx('type')}>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon className={cx('icon-interact')} icon={faHeart} />
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
