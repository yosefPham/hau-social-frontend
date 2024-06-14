import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './RenderImage.module.scss';
import { Image } from 'antd';

const cx = classNames.bind(styles);


const ImageComponent = ({ src }) => {
    const imageRef = useRef(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleImageLoad = () => {
            if (imageRef.current) {
                const { width, height } = imageRef.current;
                setImageSize({ width, height });
            }
        };

        if (imageRef.current) {
            imageRef.current.addEventListener('load', handleImageLoad);
        }

        return () => {
            if (imageRef.current) {
                imageRef.current.removeEventListener('load', handleImageLoad);
            }
        };
    }, []);
    const getImageWidth = () => {
        if (imageSize.width > imageSize.height) {
            return '100%';
        } else {
            return '50%';
        }
    };
    return (
        <img ref={imageRef} src={src} alt="Image" style={{ width: getImageWidth() }}/>
    );
};

export default ImageComponent;