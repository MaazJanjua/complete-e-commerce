import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    useGetCartQuery,
    useUpdateCartQuantityMutation,
    useRemoveCartItemMutation
} from '../../redux/services/productApi';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useGetCartQuery();
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

    const cart = data?.data || { items: [], totalPrice: 0 };
    const items = cart.items || [];

    const handleQuantityChange = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await updateQuantity({ productId, quantity: newQty }).unwrap();
        } catch (err) {
            alert(err?.data?.message || 'Could not update quantity');
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeItem(productId).unwrap();
        } catch (err) {
            alert(err?.data?.message || 'Could not remove item');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading Your Cart...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-sm text-red-600 font-bold">{error?.data?.message || 'Failed to load cart'}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <FiShoppingBag className="text-2xl" />
                </div>
                <h2 className="text-xl font-black uppercase text-gray-900">Your Cart is Empty</h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Abhi tak aap ne cart mein koi product add nahi kiya. Storefront explore karein aur apni pasandida items shamil karein!
                </p>
                <Link
                    to="/"
                    className="inline-block mt-4 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const shippingFee = cart.totalPrice >= 2999 ? 0 : 200;
    const grandTotal = cart.totalPrice + shippingFee;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Shopping Cart</h1>
                    <p className="text-xs text-gray-500 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your bag</p>
                </div>
                <Link to="/" className="text-xs font-bold uppercase text-gray-500 hover:text-black flex items-center gap-1.5">
                    <FiArrowLeft /> Continue Shopping
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const product = item.product || {};
                        const thumb = product.productImages?.[0]?.url?.replace('http://', 'https://') || 'https://via.placeholder.com/120';

                        return (
                            <div
                                key={product._id}
                                className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-xs"
                            >
                                <Link to={`/product/${product.slug || product._id}`} className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                    <img src={thumb} alt={product.title} className="w-full h-full object-cover" />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/product/${product.slug || product._id}`}
                                        className="text-sm font-black text-gray-900 uppercase hover:underline line-clamp-1"
                                    >
                                        {product.title}
                                    </Link>
                                    <p className="text-xs font-bold text-gray-500 mt-1">
                                        Unit Price: PKR {product.price?.toLocaleString()}
                                    </p>

                                    <div className="flex items-center justify-between mt-3">
                                        {/* Quantity Controls */}
                                        <div className="inline-flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                type="button"
                                                disabled={item.quantity <= 1 || isUpdating}
                                                onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                                                className="p-2 text-gray-600 hover:text-black disabled:opacity-40"
                                            >
                                                <FiMinus className="text-xs" />
                                            </button>
                                            <span className="px-3.5 text-xs font-black text-gray-900">{item.quantity}</span>
                                            <button
                                                type="button"
                                                disabled={item.quantity >= product.stock || isUpdating}
                                                onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                                                className="p-2 text-gray-600 hover:text-black disabled:opacity-40"
                                            >
                                                <FiPlus className="text-xs" />
                                            </button>
                                        </div>

                                        {/* Item Subtotal & Delete */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-gray-900">
                                                PKR {(product.price * item.quantity).toLocaleString()}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={isRemoving}
                                                onClick={() => handleRemove(product._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove item"
                                            >
                                                <FiTrash2 className="text-base" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right: Order Summary */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit space-y-5">
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                        Order Summary
                    </h2>

                    <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between text-gray-600 font-semibold">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-bold">PKR {cart.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-semibold">
                            <span>Shipping (Free above PKR 2,999)</span>
                            <span className="text-gray-900 font-bold">
                                {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}
                            </span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-gray-900">Estimated Total</span>
                        <span className="text-lg font-black text-gray-900">PKR {grandTotal.toLocaleString()}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Proceed to Checkout <FiArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;