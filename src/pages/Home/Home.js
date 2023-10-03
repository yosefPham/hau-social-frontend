import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMusic } from '@fortawesome/free-solid-svg-icons';

import styles from './Home.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import * as videoService from '~/services/videoService';
import ItemRender from '~/components/Render';
import { getListPost } from '~/services/postService';
const cx = classNames.bind(styles);

function Home() {
    const [suggestedUser, setSuggestedUser] = useState([]);
    useEffect(() => {
        // videoService
        //     .video()
        //     .then((data) => {
        //         setSuggestedUser(data);
        //     })
        //     .catch((error) => console.log(error));
        getInitData();
    }, []);
    const getInitData = async () => {
        const res = await getListPost(1, 7);
        setSuggestedUser(res?.data?.result);
        console.log('res', res);
    };
    return (
        <aside className={cx('wrapper')}>
            {suggestedUser?.map((data) => {
                return (
                    <div key={data.id} className={cx('account-item')}>
                        <div className={cx('user')}>
                            <div className={cx('user-account')}>
                                <div className={cx('user-body')}>
                                    <div className={cx('user-info')}>
                                        <Image
                                            src={data?.userId?.avatar}
                                            size={'large'}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <p className={cx('nickname')}>
                                            <strong>{data?.userId?.nickname}</strong>
                                            {data.userId.tick && (
                                                <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                            )}
                                        </p>
                                        <p className={cx('name')}>{data?.userId?.fullname}</p>
                                    </div>
                                    <div className={cx('information')}>
                                        <span>{data?.description}</span>
                                        <a>#lol</a>
                                        <a>#comedy</a>
                                        <a>#bashtheentertainer</a>
                                    </div>
                                    {data?.music && (
                                        <h4 className={cx('music-name')}>
                                            <FontAwesomeIcon className={cx('icon-music')} icon={faMusic} />
                                            <a href="">{data?.music}</a>
                                        </h4>
                                    )}
                                </div>
                                <Button className={cx('button-fl')} outline small>
                                    Follow
                                </Button>
                            </div>
                            <ItemRender data={data} />
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}

export default Home;
