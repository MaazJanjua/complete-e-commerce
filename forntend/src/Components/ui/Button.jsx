// forntend/src/components/ui/Button.jsx
import React from 'react'


const Button = ({
    children,
    type = "button",
    variant = 'primary',//'primary', 'secondary','cutline','danger'
    fullWidth = true,
    isLoading = false,
    disabled = false,
    onClick,
    className = "",
    ...props
}) => {

    const baseStyle = 'py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
        secondary: 'bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400',
        outline: 'border border-black text-black hover:bg-black hover:text-white',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    }

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onclick}
            className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className} {...props} `}
        >
            {isLoading ? "Processing..." : children}

        </button>
    )
}

export default Button
