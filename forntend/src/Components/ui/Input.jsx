// forntend/src/components/ui/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(
    (
        {
            label,
            type = 'text',
            error,
            className = '',
            containerClassName = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-800">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    ref={ref}
                    className={`w-full border px-3 py-2 text-sm focus:outline-none transition-colors ${error
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-black'
                        } ${props.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;