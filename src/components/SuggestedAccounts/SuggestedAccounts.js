import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import { useState } from 'react';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label, data = [], handleFollow, getAllUsers }) {
    const [isMore, setMore] = useState(false)
    const handleClick = () => {
        setMore(!isMore)
        getAllUsers()
    }
    console.log('isMore', isMore)
    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {data.map((account) => (
                <AccountItem key={account.id} data={account} handleFollow={handleFollow} />
            ))}
            {!isMore && <p className={cx('more-btn')} onClick={handleClick}>Xem tất cả</p>}
        </div>
    );
}

SuggestedAccounts.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.array,
};

export default SuggestedAccounts;
