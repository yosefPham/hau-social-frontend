import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMusic } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';
import styles from './AccountView.module.scss';
import Image from '~/components/Image';
const cx = classNames.bind(styles);

function AccountView({ data, style, handleClick }) {
    return (
        <div key={data?.id} className={cx('account-item')} style={style}>
            <Image src={data?.userId?.avatar} size={'large'} />
            <div className={cx('user')}>
                <div className={cx('user-account')}>
                    <div className={cx('user-body')}>
                        <div className={cx('user-info')}>
                            <p className={cx('nickname')}>
                                <strong>{data?.userId?.nickname}</strong>
                                {data?.userId?.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
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
                    <Button className={cx('button-fl')} primary small onClick={() => handleClick(data)}>
                        Follow
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AccountView;
