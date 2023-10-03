import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMusic } from '@fortawesome/free-solid-svg-icons';

import styles from './Following.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import * as videoFlService from '~/services/videoFlService';
import ItemRender from '~/components/Render';
const cx = classNames.bind(styles);

function Following() {
    const [play, setPlay] = useState(false);
    const [suggestedUser, setSuggestedUser] = useState([]);
    useEffect(() => {
        videoFlService
            .video()
            .then((data) => {
                setSuggestedUser(data);
            })
            .catch((error) => console.log(error));
    }, []);
    return (
        <aside className={cx('wrapper')}>
            <h1>Profile page</h1>
        </aside>
    );
}

export default Following;
