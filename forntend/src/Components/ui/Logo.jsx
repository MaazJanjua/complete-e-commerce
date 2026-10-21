// forntend/src/components/ui/Logo.jsx
import React from 'react';

const Logo = ({ className = '', size = 'md' }) => {
    const sizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    };

    return (
        <span className={` tracking-tight uppercase  font-extrabold text-black ${sizes[size]} ${className} `}>
            <span >HM</span>  SHOP
        </span>
    );
};

export default Logo;