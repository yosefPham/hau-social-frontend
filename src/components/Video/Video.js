import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faCommentDots,
    faShare,
    faPlay,
    faPause,
    faVolumeLow,
    faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { Slider, ConfigProvider } from 'antd';
import styles from './Video.module.scss';
import ReactPlayer from 'react-player';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

const Video = ({ data, playing, currentTime, size, defaultVolume, onHandleVideo, index, isPlaying, isPage }) => {
    const navigate = useNavigate();
    const [play, setPlay] = useState(playing ?? false);
    const [volume, setVolume] = useState(defaultVolume ?? 100);
    const [visible, setVisible] = useState(false);
    const handlePlayVideo = () => {
        setPlay(!play);
        if (typeof isPlaying === 'boolean') {
            onHandleVideo(index);
        }
    };
    const handleNavigate = () => {
        if (isPage) {
            navigate(`/@${data?.nickname}/video/${data?._id}`, { data: data });
        }
    };
    // useEffect(() => {}, [isPlaying]);
    return (
        <div className={cx('user-video')}>
            <div
                className={size === 'small' ? cx('small-video') : cx('video')}
                onMouseEnter={typeof isPlaying === 'boolean' && handlePlayVideo}
                onClick={handleNavigate}
            >
                <div onClick={handlePlayVideo}>
                    <ReactPlayer
                        className="video"
                        poster={data?.thumb_url}
                        url={data?.file_url}
                        width="100%"
                        height="100%"
                        playing={isPlaying ?? play}
                        loop
                        volume={volume / 100}
                    />
                </div>
                {size !== 'small' && (
                    <>
                        <div className={cx('button-play')}>
                            {!play && (
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className={cx('button-icon-play')}
                                    onClick={handlePlayVideo}
                                />
                            )}
                            {play && (
                                <FontAwesomeIcon
                                    icon={faPause}
                                    className={cx('button-icon-play')}
                                    onClick={handlePlayVideo}
                                />
                            )}
                        </div>
                        <div className={cx('button-volume')} onMouseEnter={() => setVisible(false)}>
                            {visible && volume !== 0 && (
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Slider: {
                                                handleLineWidth: 1,
                                                handleLineWidthHover: 1,
                                                railSize: 3,
                                                handleSize: 6,
                                                handleSizeHover: 9,
                                            },
                                        },
                                    }}
                                >
                                    <Slider
                                        className={cx('button-slider')}
                                        vertical
                                        value={volume}
                                        max={100}
                                        min={0}
                                        onChange={(value) => setVolume(value)}
                                        trackStyle={{ backgroundColor: '#fff' }}
                                    />
                                </ConfigProvider>
                            )}
                            {volume !== 0 ? (
                                <FontAwesomeIcon
                                    icon={faVolumeLow}
                                    className={cx('button-icon-volume')}
                                    onClick={() => setVolume(0)}
                                    onMouseMove={() => setVisible(true)}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faVolumeXmark}
                                    className={cx('button-icon-volume')}
                                    onClick={() => setVolume(50)}
                                    onMouseMove={() => setVisible(true)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Video;
