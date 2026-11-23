import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
    useAddToCartMutation
} from '../../redux/services/productApi';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useGetWishlistQuery();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const [addToCart] = useAddToCartMutation();

    const products = data?.data?.products || [];

    const handleMoveToCart = async (product) => {
        try {
            await addToCart({ productId: product._id, quantity: 1 }).unwrap();
            await removeFromWishlist(product._id).unwrap();
            navigate('/cart');
        } catch (err) {
            alert(err?.data?.message || 'Could not move item to cart');
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId).unwrap();
        } catch (err) {
            alert(err?.data?.message || 'Failed to remove item');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading Wishlist...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm font-bold text-red-600">
                {error?.data?.message || 'Failed to load wishlist'}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[65vh]">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">My Wishlist</h1>
                    <p className="text-xs text-gray-500 mt-1">{products.length} saved {products.length === 1 ? 'item' : 'items'}</p>
                </div>
                <Link to="/" className="text-xs font-bold uppercase text-gray-500 hover:text-black flex items-center gap-1.5">
                    <FiArrowLeft /> Explore Store
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <FiHeart className="text-3xl text-gray-400 mx-auto" />
                    <h2 className="text-lg font-black uppercase text-gray-900">Your Wishlist is Empty</h2>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                        Jo products aapko pasand aayein unke dil (heart) icon par click karein taake woh yahan save rahein.
                    </p>
                    <Link
                        to="/"
                        className="inline-block mt-3 bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-lg hover:bg-gray-800"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const thumb = product.productImages?.[0]?.url?.replace('http://', 'https://') || 'https://via.placeholder.com/400x500';
                        const isOutOfStock = product.stock <= 0;

                        return (
                            <div
                                key={product._id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                            >
                                <Link to={`/product/${product.slug || product._id}`} className="relative aspect-3/4 bg-gray-100 overflow-hidden block">
                                    <img src={thumb} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                    {isOutOfStock && (
                                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded">
                                            Out of Stock
                                        </span>
                                    )}
                                </Link>

                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <Link
                                            to={`/product/${product.slug || product._id}`}
                                            className="text-xs font-black uppercase text-gray-900 hover:underline line-clamp-1"
                                        >
                                            {product.title}
                                        </Link>
                                        <p className="text-sm font-black text-blue-700 mt-1">
                                            PKR {product.price?.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            type="button"
                                            disabled={isOutOfStock}
                                            onClick={() => handleMoveToCart(product)}
                                            className="flex-1 bg-black text-white text-[11px] font-extrabold uppercase py-2.5 px-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <FiShoppingBag /> Move to Cart
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(product._id)}
                                            className="p-2.5 border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Remove from Wishlist"
                                        >
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;