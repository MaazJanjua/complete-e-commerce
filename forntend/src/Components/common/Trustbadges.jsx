import React from 'react'
import { FiTruck, FiAward, FiHeadphones, FiCheckCircle } from 'react-icons/fi'

const Trustbadges = () => {

    const features = [
        {
            id: 1,
            icon: <FiTruck className='text-2xl sm:text-3xl text-gray-800' />,
            title: "FREE SHIPPING",
            subtitle: "On all orders above PKR2,999"
        },
        {
            id: 2,
            icon: <FiAward className="text-2xl sm:text-3xl text-gray-800" />,
            title: 'PREMIUM QUALITY',
            subtitle: 'Handpicked & quality checked',
        },
        {
            id: 3,
            icon: <FiCheckCircle className="text-2xl sm:text-3xl text-gray-800" />,
            title: '100% SANITIZED',
            subtitle: 'Washed & ready to wear',
        },
        {
            id: 4,
            icon: <FiHeadphones className="text-2xl sm:text-3xl text-gray-800" />,
            title: '24/7 SUPPORT',
            subtitle: "We're here to help",
        },
    ]

    return (
        <section className="w-full bg-[#f8f9fa] border-y border-gray-200 py-4 my-4">
            <div className="max-w-[89vw] mx-auto px-1 sm:px-4">
                <div className="grid grid-cols-4 gap-1 sm:gap-4 divide-x divide-gray-200">
                    {features.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 px-1 sm:px-4 text-center sm:text-left"
                        >
                            {/* Icon Container with Mobile Scaling */}
                            <div className="shrink-0 text-lg sm:text-2xl md:text-3xl text-gray-800">
                                {item.icon}
                            </div>

                            {/* Text Container */}
                            <div>
                                <h4 className="text-[9px] xs:text-[10px] sm:text-sm font-extrabold tracking-tight sm:tracking-wider text-black uppercase leading-tight">
                                    {item.title}
                                </h4>
                                <p className="text-[8px] xs:text-[9px] sm:text-xs text-gray-500 font-medium mt-0.5 line-clamp-2 sm:line-clamp-none">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Trustbadges
