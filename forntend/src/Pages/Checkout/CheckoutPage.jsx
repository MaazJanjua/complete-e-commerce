import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCartQuery, useCreateOrderMutation } from '../../redux/services/productApi';
import { FiTruck, FiCheckCircle, FiArrowLeft, FiLock } from 'react-icons/fi';

const CheckoutPage = () => {
    const navigate = useNavigate();
    // const { user } = useSelector((state) => state.auth || {});
    const user = useSelector((state) => state.auth?.user);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

    const cart = cartData?.data || { items: [], totalPrice: 0 };
    const items = cart.items || [];

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: '',
        city: '',
        address: ''
    });

    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await createOrder(shippingAddress).unwrap();
            const createdOrder = response?.data;
            // Redirect to Order Tracking / Confirmation Page
            navigate(`/orders/${createdOrder._id}`, { state: { justPlaced: true } });
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to place order. Please try again.');
        }
    };

    if (isCartLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-lg font-black uppercase">No Items to Checkout</h2>
                <Link to="/" className="inline-block bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-lg">
                    Return to Store
                </Link>
            </div>
        );
    }

    const shippingFee = cart.totalPrice >= 2999 ? 0 : 200;
    const grandTotal = cart.totalPrice + shippingFee;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-gray-500 hover:text-black mb-6">
                <FiArrowLeft /> Back to Cart
            </Link>

            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-8">
                Checkout & Delivery
            </h1>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Shipping Details & Payment Method */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                            1. Shipping Information
                        </h2>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-600">
                                {errorMsg}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-gray-600 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={shippingAddress.name}
                                    onChange={handleChange}
                                    placeholder="Muhammad Maaz"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-gray-600 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={shippingAddress.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-gray-600 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={shippingAddress.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="0300-1234567"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase text-gray-600 mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={shippingAddress.city}
                                    onChange={handleChange}
                                    placeholder="Islamabad / Rawalpindi"
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-extrabold uppercase text-gray-600 mb-1">Complete Street Address *</label>
                            <textarea
                                name="address"
                                rows="3"
                                required
                                value={shippingAddress.address}
                                onChange={handleChange}
                                placeholder="House #, Street #, Sector / Area..."
                                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    {/* Payment Method (COD Active, Online Coming Soon) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                            2. Payment Method
                        </h2>

                        <div className="space-y-3">
                            {/* Active COD Option */}
                            <label className="flex items-center justify-between p-4 border-2 border-black bg-gray-50 rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FiTruck className="text-xl text-black" />
                                    <div>
                                        <p className="text-xs font-black uppercase text-gray-900">Cash on Delivery (COD)</p>
                                        <p className="text-[11px] text-gray-500">Pay in cash when your parcel arrives at your doorstep.</p>
                                    </div>
                                </div>
                                <FiCheckCircle className="text-lg text-black" />
                            </label>

                            {/* Future Card / Online Payment Placeholder */}
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-700">Credit / Debit Card & Online Transfer</p>
                                    <p className="text-[11px] text-gray-400">Coming soon in next update</p>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-gray-100 px-2 py-1 rounded">Soon</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Order Items & Confirm Button */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit space-y-5">
                    <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                        Your Order ({items.length})
                    </h2>

                    <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                        {items.map((item) => (
                            <div key={item.product?._id} className="py-2.5 flex justify-between gap-3 text-xs">
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{item.product?.title}</p>
                                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-bold text-gray-900 shrink-0">
                                    PKR {(item.product?.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600 font-semibold">
                            <span>Subtotal</span>
                            <span>PKR {cart.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-semibold">
                            <span>Delivery Charges</span>
                            <span>{shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="font-black uppercase text-gray-900">Total Payable (COD)</span>
                            <span className="text-lg font-black text-gray-900">PKR {grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPlacingOrder}
                        className="w-full bg-black text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FiLock /> {isPlacingOrder ? 'Placing Order...' : 'Confirm COD Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;