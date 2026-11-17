import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../../Components/ui/Button';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // 1. Safe extraction for Title & Category
    const productTitle = product?.title || product?.name || "Untitled Product";
    const categoryName = product?.category?.name || "Clothing";

    // 2. Build Clean Array of All Available Product Images
    const getImagesList = () => {
        const rawList = product?.productImages?.length > 0
            ? product.productImages
            : product?.images?.length > 0
                ? product.images
                : product?.thumbnail
                    ? [product.thumbnail]
                    : [];

        const formattedUrls = rawList
            .map((img) => {
                const url = typeof img === "string" ? img : img?.url;
                return typeof url === "string" ? url.replace("http://", "https://") : null;
            })
            .filter(Boolean);

        return formattedUrls.length > 0
            ? formattedUrls
            : ["https://via.placeholder.com/400x500?text=No+Image"];
    };

    const images = getImagesList();
    const hasMultipleImages = images.length > 1;

    // 3. Carousel Navigation Handlers (Preventing Card Redirect)
    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleDotClick = (e, index) => {
        e.stopPropagation();
        setCurrentImgIndex(index);
    };

    const handleCardClick = () => {
        navigate(`/product/${product?._id}`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        console.log("added to cart", product?._id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            {/* Image Container & Slider */}
            <div className="relative w-full aspect-3/4 bg-gray-100 overflow-hidden">
                <img
                    src={images[currentImgIndex]}
                    alt={`${productTitle} - view ${currentImgIndex + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                />

                {/* Stock Badge */}
                {product?.stock <= 0 && (
                    <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded">
                        Out of Stock
                    </span>
                )}

                {/* Slider Arrows (Visible on Hover when multiple images exist) */}
                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs text-black shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-200"
                        >
                            <FiChevronLeft className="text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs text-black shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all duration-200"
                        >
                            <FiChevronRight className="text-sm" />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => handleDotClick(e, idx)}
                                    aria-label={`Slide ${idx + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-200 ${
                                        currentImgIndex === idx
                                            ? "w-3.5 bg-white"
                                            : "w-1.5 bg-white/60 hover:bg-white"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Product Details */}
            <div className="p-2 flex flex-col grow justify-between text-left">
                <div>
                    <span className="md:text-[10px] text-[8px] uppercase font-bold text-gray-400 tracking-wider">
                        {categoryName}
                    </span>
                </div>
                <h3 className="md:text-[10px] text-[9px] font-bold text-gray-900 uppercase tracking-tight truncate mt-1">
                    {productTitle}
                </h3>
            </div>

            {/* Price & Action */}
            <div className="flex md:flex-row sm:flex-col items-center md:px-4 gap-2 md:text-[10px] text-[9px] p-2">
                <span>
                    PKR - <span className="text-blue-700">{product?.price ? product.price.toLocaleString() : '0'}</span>
                </span>

                <Button
                    type="button"
                    onClick={handleAddToCart}
                    variant="Outline"
                    className="w-auto! py-1! px-3! text-xs border rounded my-2 border-black! hover:bg-black! hover:text-white! md:text-[10px] text-[8px]"
                >
                    Add To Cart
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;