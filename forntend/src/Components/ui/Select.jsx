// forntend/src/components/ui/Select.jsx
import React, { forwardRef } from 'react';

const Select = forwardRef(
    (
        {
            label,
            options = [],
            error,
            placeholder = 'Select an option',
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-gray-800">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full border px-3 py-2 text-sm focus:outline-none bg-white transition-colors ${error
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-black'
                        } ${className}`}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
export default Select;