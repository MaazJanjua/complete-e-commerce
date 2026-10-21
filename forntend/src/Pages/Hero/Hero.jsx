// src/Pages/Hero/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SearchByCategory from '../../Components/Fab-flower-search-by-categpry/searchByCategory';

// Import your local video assets here if needed:
// import video1 from '../../assets/videos/hero-1.mp4';
// import video2 from '../../assets/videos/hero-2.mp4';
// import video3 from '../../assets/videos/hero-3.mp4';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const videoRefs = useRef([]);

    // 3 Slide Configuration Data
    const slides = [
        {
            id: 1,
            badge: 'New Arrivals',
            buttonText:'Explore',
            videoUrl: 'https://res.cloudinary.com/do3j9i0pl/video/upload/v1792492693/_Ugc_Ad_20261020153748_gudvnk.mp4',
        },
        {
            id: 2,
            badge: 'Streetwear Edition',
            title: 'URBAN VIBES',
            description: 'Exclusive oversized hoodies and classic denim thrift finds.',
            buttonText: 'Explore Streetwear',
            videoUrl: 'https://res.cloudinary.com/do3j9i0pl/video/upload/v1792493033/_Ugc_Ad_20261020153742_sleq2g.mp4',
        },
        {
            id: 3,
            badge: 'Limited Drop',
            title: 'VINTAGE CORE',
            description: 'Handcrafted quality jackets and timeless athletic trousers.',
            buttonText: 'View Drop',
            videoUrl: 'https://res.cloudinary.com/do3j9i0pl/video/upload/v1792493040/Ugc_ad_black_background_20261020153738_pohitr.mp4',
        },
    ];

    // 1. Auto-advance slide every 5 seconds (4000ms) for an infinite loop
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    // 2. Play active video from start whenever slide changes
    useEffect(() => {
        if (videoRefs.current[currentSlide]) {
            videoRefs.current[currentSlide].currentTime = 0;
            videoRefs.current[currentSlide].play().catch(() => {
                // Auto-play prevention catch
            });
        }
    }, [currentSlide]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <section
            className="relative w-full h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh]  overflow-hidden"
            aria-label="Hero video carousel"
        >
            {/* 3. SLIDER CONTAINER (Translates horizontally for infinite slide animation) */}
            <div
                className="flex w-full h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    return (
                        <div
                            key={slide.id}
                            className="relative w-full h-full shrink-0"
                        >
                            {/* Background Video */}
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-92"
                            >
                                <source src={slide.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Dark Readability Overlay */}
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Slide Text Content */}
                            <div className="absolute inset-0 z-20 flex items-center justify-start w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                                <div
                                    className={`max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] text-white transition-all duration-500 transform ${
                                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                                    }`}
                                >
                                    {/* Badge */}
                                    <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 sm:mb-4 border border-white/20">
                                        <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-200 font-semibold">
                                            {slide.badge}
                                        </span>
                                    </div>

                                    {/* Main Heading */}
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tight">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-200 max-w-full sm:max-w-[85%] font-normal">
                                        {slide.description}
                                    </p>

                                    {/* Action Button */}
                                    <button
                                        className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 mt-5 sm:mt-6 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-xl uppercase tracking-wider"
                                        aria-label={slide.buttonText}
                                    >
                                        {slide.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 4. NAVIGATION ARROWS */}
            <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20 transition-all text-sm md:text-base"
                aria-label="Previous Slide"
            >
                <FaChevronLeft />
            </button>
            <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20 transition-all text-sm md:text-base"
                aria-label="Next Slide"
            >
                <FaChevronRight />
            </button>

            {/* 5. SLIDE INDICATOR DOTS */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>

            {/* Floating Category Menu */}
            <SearchByCategory />
        </section>
    );
};

export default Hero;