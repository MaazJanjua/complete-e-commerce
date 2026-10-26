import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const PromoBannersAndInstagram = () => {
    const promoCards = [
        {
            id: 1,
            title: 'NEW DROPS',
            subtitle: 'Every Week',
            buttonText: 'EXPLORE',
            link: '/Shirts',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
        },
        {
            id: 2,
            title: 'PREMIUM THRIFT',
            subtitle: 'Handpicked Pieces',
            buttonText: 'EXPLORE',
            link: '/trousers',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
        },
        {
            id: 3,
            title: 'UP TO 50% OFF',
            subtitle: 'Limited Time Only',
            buttonText: 'SHOP SALE',
            link: '/Shirts',
            image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
        },
    ];

    const instagramPosts = [
        { id: 1, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300&auto=format&fit=crop' },
        { id: 2, img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=300&auto=format&fit=crop' },
        { id: 3, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop' },
        { id: 4, img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop' },
        { id: 5, img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop' },
        { id: 6, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop' },
        { id: 7, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' },
        { id: 8, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop' },
    ];

    return (
        <div className="w-full space-y-12 my-12">
            <section className="max-w-[89vw] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {promoCards.map((card) => (
                        <div
                            key={card.id}
                            className="relative h-64 sm:h-72 bg-black overflow-hidden group flex items-center justify-between p-6 sm:p-8"
                        >
                            <div className="z-10 max-w-[55%] text-white space-y-2">
                                <h3 className="text-lg sm:text-xl font-extrabold tracking-wider uppercase leading-tight">
                                    {card.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-medium">
                                    {card.subtitle}
                                </p>
                                <div className="pt-4">
                                    <Link
                                        to={card.link}
                                        className="inline-block bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                    >
                                        {card.buttonText}
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-[55%] h-full">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full bg-black text-white py-6 overflow-hidden">
                <div className="max-w-[89vw] mx-auto px-4 flex flex-col lg:flex-row items-center gap-6">

                    {/* Left Brand Text */}
                    <div className="shrink-0 text-center lg:text-left">
                        <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-widest">
                            FOLLOW US ON INSTAGRAM
                        </h4>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-gray-400 hover:text-white transition-colors mt-0.5 inline-block"
                        >
                            @hm.thrift
                        </a>
                    </div>

                    {/* Dynamic Responsive Image Grid (Fills 100% Space Evenly) */}
                    <div className="flex-1 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3 w-full">
                        {instagramPosts.slice(0, 8).map((post) => (
                            <a
                                key={post.id}
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="aspect-square w-full bg-gray-800 overflow-hidden group relative block rounded-md"
                            >
                                <img
                                    src={post.img}
                                    alt="Instagram Post"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">📷</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Right Arrow Link */}
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 p-3 hover:bg-gray-900 rounded-full transition-colors hidden lg:flex items-center justify-center"
                        aria-label="Visit Instagram"
                    >
                        <FiArrowRight className="text-xl" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default PromoBannersAndInstagram;