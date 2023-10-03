import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import { faHashtag, faMusic } from '@fortawesome/free-solid-svg-icons';

import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
} from '~/components/Icons';
import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';
import { getListUser, getUser } from '~/services/userServive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '~/context/UserContext';

const cx = classNames.bind(styles);

function Sidebar() {
    const [suggestedUser, setSuggestedUser] = useState([]);
    const { handleFollow } = useContext(UserContext);
    useEffect(() => {
        getDataUser();
    }, []);

    const handleUserFollow = async (id, type) => {
        const res = await handleFollow(id, type);
        if (res?.data?.status === 200) {
            getDataUser();
        }
    };

    useEffect(() => {}, [suggestedUser]);

    const getDataUser = async () => {
        const result = await getListUser(1, 7);
        if (result?.data?.status === 200) {
            setSuggestedUser(result?.data?.result);
        }
        console.log('res', result);
    };

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem
                    title="Dành cho bạn"
                    to={config.routes.home}
                    icon={<HomeIcon />}
                    activeIcon={<HomeActiveIcon />}
                />
                <MenuItem
                    title="Đang Follow"
                    to={config.routes.following}
                    icon={<UserGroupIcon />}
                    activeIcon={<UserGroupActiveIcon />}
                />
                <MenuItem title="LIVE" to={config.routes.live} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} />
            </Menu>
            <div className={cx('scroll-bar')}>
                <SuggestedAccounts label="Suggested accounts" data={suggestedUser} handleFollow={handleUserFollow} />
                <SuggestedAccounts label="Following accounts" data={suggestedUser} handleFollow={handleUserFollow} />
                <div className={cx('discover')}>
                    <p className={cx('header-discover')}>Discover</p>
                    <div className={cx('list-hashtag')}>
                        <a className={cx('hashtag')} to="/">
                            <div className={cx('hashtag-content')}>
                                <FontAwesomeIcon className={cx('hashtag-icon')} icon={faHashtag} />
                                <p className={cx('hashtag-name')}>suthtla</p>
                            </div>
                        </a>
                        <a className={cx('hashtag')} to="/">
                            <div className={cx('hashtag-content')}>
                                <FontAwesomeIcon className={cx('hashtag-icon')} icon={faHashtag} />
                                <p className={cx('hashtag-name')}>mackedoi</p>
                            </div>
                        </a>
                        <a className={cx('hashtag')} to="/">
                            <div className={cx('hashtag-content')}>
                                <FontAwesomeIcon className={cx('hashtag-icon')} icon={faHashtag} />
                                <p className={cx('hashtag-name')}>sansangthaydoi</p>
                            </div>
                        </a>
                        <a className={cx('hashtag')} to="/">
                            <div className={cx('hashtag-content')}>
                                <FontAwesomeIcon className={cx('hashtag-icon')} icon={faMusic} />
                                <p className={cx('hashtag-name')}>
                                    Yêu Đơn Phương Là Gì (MEE Remix) - Mee Media & h0n & BHMedia
                                </p>
                            </div>
                        </a>
                        <a className={cx('hashtag')} to="/">
                            <div className={cx('hashtag-content')}>
                                <FontAwesomeIcon className={cx('hashtag-icon')} icon={faMusic} />
                                <p className={cx('hashtag-name')}>Thiên Thần Tình Yêu - RICKY STAR</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div className={cx('footer')}>
                    <div className={cx('tiktok-link')}>
                        <a href="https://www.tiktok.com/about?lang=en">About</a>
                        <a href="https://newsroom.tiktok.com/">Newsroom</a>
                        <a href="https://www.tiktok.com/about?lang=en">Contact</a>
                        <a href="https://www.tiktok.com/about?lang=en">Careers</a>
                        <a href="https://www.tiktok.com/about?lang=en">ByteDance</a>
                    </div>
                    <div className={cx('tiktok-link')}>
                        <a href="https://www.tiktok.com/about?lang=en">TikTok for Good</a>
                        <a href="https://newsroom.tiktok.com/">Advertise</a>
                        <a href="https://www.tiktok.com/about?lang=en">Developers</a>
                        <a href="https://www.tiktok.com/about?lang=en">Transparency</a>
                    </div>
                    <div className={cx('tiktok-link')}>
                        <a href="https://www.tiktok.com/about?lang=en">TikTok Rewards</a>
                        <a href="https://newsroom.tiktok.com/">TikTok Browse</a>
                        <a href="https://www.tiktok.com/about?lang=en">TikTok Embeds</a>
                    </div>
                    <div className={cx('tiktok-link')}>
                        <a href="https://www.tiktok.com/about?lang=en">© 2023 TikTok</a>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
