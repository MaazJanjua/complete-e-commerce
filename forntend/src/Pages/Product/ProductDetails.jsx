import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    useGetProductByIdQuery,
    useAddToCartMutation,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetWishlistQuery
} from '../../redux/services/productApi';
import {
    FiArrowLeft,
    FiShoppingBag,
    FiHeart,
    FiMinus,
    FiPlus,
    FiCheckCircle,
    FiTruck,
    FiShield
} from 'react-icons/fi';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useGetProductByIdQuery(slug);
    const product = data?.data || {};

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [feedback, setFeedback] = useState({ type: '', text: '' });

    // Cart & Wishlist Mutations
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    const token = localStorage.getItem("token");
    const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !token });

    const [addToWishlist] = useAddToWishlistMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const wishlistProducts = wishlistData?.data?.products || [];
    const isWishlisted = wishlistProducts.some(
        (item) => (item._id || item) === product._id
    );

    // Format Images Array safely
    const images = (product?.productImages?.length > 0
        ? product.productImages
        : product?.thumbnail
            ? [product.thumbnail]
            : []
    ).map((img) => {
        const url = typeof img === 'string' ? img : img?.url;
        return typeof url === 'string' ? url.replace('http://', 'https://') : '';
    }).filter(Boolean);

    const displayImages = images.length > 0
        ? images
        : ['https://via.placeholder.com/600x750?text=No+Image'];

    useEffect(() => {
        setSelectedImage(0);
        setQuantity(1);
        setFeedback({ type: '', text: '' });
    }, [slug]);

    const showNotice = (type, text) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback({ type: '', text: '' }), 3500);
    };

    const handleAddToCart = async () => {
        try {
            await addToCart({ productId: product._id, quantity }).unwrap();
            showNotice('success', 'Product added to your cart!');
        } catch (err) {
            if (err?.status === 401) {
                navigate('/login');
            } else {
                showNotice('error', err?.data?.message || 'Failed to add to cart');
            }
        }
    };

    const handleWishlistToggle = async () => {
        try {
            if (isWishlisted) {
                await removeFromWishlist(product._id).unwrap();
                showNotice('success', 'Removed from wishlist');
            } else {
                await addToWishlist(product._id).unwrap();
                showNotice('success', 'Added to wishlist!');
            }
        } catch (err) {
            if (err?.status === 401) {
                navigate('/login');
            } else {
                showNotice('error', err?.data?.message || 'Wishlist update failed');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Loading Product Details...
                </p>
            </div>
        );
    }

    if (isError || !product?._id) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-xl font-black text-gray-900 uppercase">Product Not Found</h2>
                <p className="text-xs text-gray-500">{error?.data?.message || 'The item may have been removed.'}</p>
                <Link
                    to="/"
                    className="inline-block bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-lg"
                >
                    Back to Store
                </Link>
            </div>
        );
    }

    const activePrice = product.discountPrice ?? product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-500 mb-8">
                <Link to="/" className="hover:text-black flex items-center gap-1.5">
                    <FiArrowLeft /> Home
                </Link>
                {product.category?.slug && (
                    <>
                        <span>/</span>
                        <Link
                            to={`/category/${product.category.slug}`}
                            className="hover:text-black"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                {/* Left: Image Gallery */}
                <div className="flex flex-col-reverse sm:flex-row gap-4">
                    {/* Thumbnails */}
                    {displayImages.length > 1 && (
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                            {displayImages.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${selectedImage === idx
                                        ? 'border-black scale-105'
                                        : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="relative flex-1 aspect-3/4 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                        <img
                            src={displayImages[selectedImage]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        {product.stock <= 0 && (
                            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold uppercase px-3 py-1.5 rounded-md">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Product Info & Actions */}
                <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-gray-400">
                            {product.category?.name || 'Collection'}
                        </span>

                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-gray-900">
                                PKR {activePrice?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm font-bold text-gray-400 line-through">
                                    PKR {product.price?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                    <FiCheckCircle /> In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                                    Currently Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                                Product Details
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {product.description || 'Premium quality fabric crafted for everyday comfort and modern style.'}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div className="pt-4">
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                                    Quantity
                                </label>
                                <div className="inline-flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 text-gray-600 hover:text-black disabled:opacity-40"
                                        disabled={quantity <= 1}
                                    >
                                        <FiMinus className="text-xs" />
                                    </button>
                                    <span className="px-5 text-sm font-black text-gray-900">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                        className="p-3 text-gray-600 hover:text-black disabled:opacity-40"
                                        disabled={quantity >= product.stock}
                                    >
                                        <FiPlus className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Feedback Banner */}
                        {feedback.text && (
                            <div
                                className={`p-3 rounded-lg text-xs font-bold ${feedback.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}
                            >
                                {feedback.text}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || isAddingToCart}
                                className="flex-1 bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                                <FiShoppingBag className="text-base" />
                                {isAddingToCart
                                    ? 'Adding...'
                                    : product.stock <= 0
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                className={`px-5 py-4 rounded-xl border font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${isWishlisted
                                    ? 'border-red-500 bg-red-50 text-red-600'
                                    : 'border-gray-300 text-gray-900 hover:border-black'
                                    }`}
                            >
                                <FiHeart className={isWishlisted ? 'fill-red-600 text-red-600' : ''} />
                                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                            </button>
                        </div>
                    </div>

                    {/* Store Perks */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-xs text-gray-600">
                        <div className="flex items-center gap-2.5">
                            <FiTruck className="text-lg text-black shrink-0" />
                            <span>Cash on Delivery (COD) Available Nationwide</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FiShield className="text-lg text-black shrink-0" />
                            <span>Quality Checked & Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;