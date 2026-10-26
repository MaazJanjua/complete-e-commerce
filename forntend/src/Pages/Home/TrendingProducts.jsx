import React, { useState, useEffect, useRef } from 'react';
import { useGetProductsQuery } from '../../redux/services/productApi';
import ProductCard from '../../Components/common/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TrendingProducts = () => {
    // Fetch products with limit (e.g. 16 products for sliding)
    const { data, isLoading } = useGetProductsQuery({ limit: 16 });

    const rawProducts = data?.data?.products || data?.data || data;
    const productsFromApi = Array.isArray(rawProducts) ? rawProducts : [];
    const fallbackProducts = [
        { _id: '1', name: 'Oversized Vintage Hoodie', price: 3499, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', category: { name: 'Hoodies' } },
        { _id: '2', name: 'Graphic Heavyweight Tee', price: 1899, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop', category: { name: 'T-Shirts' } },
        { _id: '3', name: 'Cargo Fit Utility Pants', price: 2999, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop', category: { name: 'Pants' } },
        { _id: '4', name: 'Classic Bomber Jacket', price: 4999, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop', category: { name: 'Jackets' } },
        { _id: '5', name: 'Relaxed Fit Sweatpants', price: 2499, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop', category: { name: 'Pants' } },
        { _id: '6', name: 'Minimalist Denim Shirt', price: 2799, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop', category: { name: 'Shirts' } },
        { _id: '7', name: 'Urban Streetwear Cap', price: 999, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop', category: { name: 'Accessories' } },
        { _id: '8', name: 'Padded Winter Vest', price: 3999, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop', category: { name: 'Jackets' } },
        { _id: '9', name: 'Fleece Track Jacket', price: 3299, image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop', category: { name: 'Jackets' } },
        { _id: '10', name: 'Slim Fit Chino Trousers', price: 2599, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop', category: { name: 'Pants' } },
    ];

    const displayProducts = productsFromApi.length > 0 ? productsFromApi : fallbackProducts;

    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Dynamic Slide Counts Calculate & Active Slide Tracking
    const updatePagination = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const viewportWidth = container.clientWidth;
        const totalWidth = container.scrollWidth;

        // Total slides calculation
        const pages = Math.ceil(totalWidth / viewportWidth);
        setTotalPages(pages || 1);

        // Current Active Slide Calculation
        const currentIndex = Math.round(container.scrollLeft / viewportWidth);
        setActiveIndex(currentIndex);
    };

    useEffect(() => {
        updatePagination();
        window.addEventListener('resize', updatePagination);
        return () => window.removeEventListener('resize', updatePagination);
    }, [displayProducts]);

    // Manual Scroll Handler
    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    // Go to specific page index
    const scrollToPage = (pageIndex) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth * pageIndex;
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    };

    // Auto-Scroll Logic for Mobile Devices (Every 5 seconds)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            if (!isPaused && window.innerWidth < 640) {
                const scrollAmount = container.clientWidth;
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (container.scrollLeft >= maxScroll - 5) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, displayProducts]);

    if (isLoading) {
        return (
            <section className="max-w-[89vw] mx-auto px-4 py-8">
                <h2 className="text-base font-extrabold tracking-[0.2em] text-center uppercase mb-8">
                    TRENDING NOW
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-8 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="aspect-3/4 bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-[89vw] mx-auto px-4 py-8 sm:py-12 relative group">
            {/* Header with Nav Controls */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-base md:text-lg font-extrabold tracking-[0.2em] uppercase text-black">
                    TRENDING NOW
                </h2>

                {/* Arrow Controls for Tablet/Desktop */}
                {totalPages > 1 && (
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => handleScroll('left')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-black text-white transition-colors"
                            aria-label="Previous Products"
                        >
                            <FiChevronLeft className="text-lg text-gray-600" />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors"
                            aria-label="Next Products"
                        >
                            <FiChevronRight className="text-lg text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Scrollable Container (Scrollbar Hidden via Tailwind `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`) */}
            <div
                ref={scrollContainerRef}
                onScroll={updatePagination}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                className="
                    flex 
                    overflow-x-auto 
                    snap-x snap-mandatory 
                    gap-3 sm:gap-4 lg:gap-3 
                    pb-4 sm:pb-0 
                    text-black
                    w-full
                    scroll-smooth
                    scrollbar-none
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                "
            >
                {displayProducts.map((product) => (
                    <div
                        key={product._id}
                        className="
                            w-[calc(50%-6px)] 
                            sm:w-[calc(33.33%-11px)] 
                            lg:w-[calc(17.5%-10.5px)] 
                            flex-none 
                            snap-start 
                            box-border
                        "
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Bottom Pagination Dot Buttons */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToPage(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                activeIndex === index
                                    ? 'w-8 bg-black'
                                    : 'w-2.5 bg-gray-300 hover:bg-gray-500'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default TrendingProducts;