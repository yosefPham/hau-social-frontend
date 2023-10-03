import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import classNames from 'classnames';
import images from '~/assets/images';
import styles from './Image.module.scss';
import { Avatar } from 'antd';

const Image = forwardRef(({ src, alt, className, fallback: customFallback = images.noImage, size, ...props }, ref) => {
    const [fallback, setFallback] = useState('');
    const handleError = () => {
        setFallback(customFallback);
    };

    return (
        <Avatar
            className={classNames(styles.wrapper, className)}
            ref={ref}
            src={src ?? fallback}
            alt={alt}
            {...props}
            onError={handleError}
            size={size || 'large'}
        />
    );
});

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default Image;
