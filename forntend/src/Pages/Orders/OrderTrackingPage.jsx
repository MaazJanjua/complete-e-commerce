import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '../../redux/services/productApi';
import {
    FiArrowLeft,
    FiCheckCircle,
    FiPackage,
    FiTruck,
    FiHome,
    FiClock,
    FiXCircle,
    FiMapPin
} from 'react-icons/fi';

const STEPS = [
    { key: 'pending', label: 'Order Placed', icon: FiClock },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiHome },
];

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const justPlaced = location.state?.justPlaced;

    const { data, isLoading, isError, error } = useGetOrderByIdQuery(orderId);
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    // Note: getOrderById returns { order } inside data.data
    const order = data?.data?.order || data?.data || {};

    const handleCancelOrder = async () => {
        if (!window.confirm('Kya aap waqai yeh order cancel karna chahte hain?')) return;
        try {
            await cancelOrder(order._id).unwrap();
        } catch (err) {
            alert(err?.data?.message || 'Order could not be cancelled');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading Order Tracking...</p>
            </div>
        );
    }

    if (isError || !order?._id) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-lg font-black uppercase text-red-600">Order Not Found</h2>
                <p className="text-xs text-gray-500">{error?.data?.message || 'Invalid order ID'}</p>
                <Link to="/orders" className="inline-block bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-lg">
                    Back to My Orders
                </Link>
            </div>
        );
    }

    const isCancelled = order.orderStatus === 'cancelled';
    const currentStepIndex = STEPS.findIndex((s) => s.key === order.orderStatus);
    const activeStep = order.orderStatus === 'processing' ? 1 : currentStepIndex;
    // const canCancel = !['shipped', 'delivered', 'cancelled'].includes(order.orderStatus);
    const status = (order.orderStatus || '').toLowerCase();
    const canCancel = ['pending', 'confirmed', 'processing'].includes(status);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-gray-500 hover:text-black">
                <FiArrowLeft /> Back to All Orders
            </Link>

            {/* Order Confirmation Banner (Shows right after checkout) */}
            {justPlaced && (
                <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
                    <FiCheckCircle className="text-3xl text-green-600 shrink-0" />
                    <div>
                        <h2 className="text-sm font-black uppercase text-green-900">Thank You! Your Order Has Been Placed</h2>
                        <p className="text-xs text-green-700 mt-0.5">
                            Order Number <span className="font-bold">{order.orderNumber}</span> confirm ho gaya hai. Parcel milne par Cash on Delivery (COD) ada karein.
                        </p>
                    </div>
                </div>
            )}

            {/* Top Summary Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">Order Tracking</span>
                    <h1 className="text-2xl font-black text-gray-900 mt-0.5">
                        {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleString('en-PK')}
                    </p>
                </div>

                {order.trackingNumber && (
                    <div className="bg-purple-50 border border-purple-200 px-4 py-3 rounded-xl">
                        <span className="text-[10px] font-extrabold uppercase text-purple-600 block">Courier Tracking Number</span>
                        <span className="text-sm font-black text-purple-900 flex items-center gap-1.5 mt-0.5">
                            <FiPackage /> {order.trackingNumber}
                        </span>
                    </div>
                )}
            </div>

            {/* Live Progress Tracker */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                {isCancelled ? (
                    <div className="flex items-center gap-3 text-red-600">
                        <FiXCircle className="text-2xl shrink-0" />
                        <div>
                            <h3 className="text-sm font-black uppercase">Order Cancelled</h3>
                            <p className="text-xs text-gray-500">Yeh order cancel kar diya gaya hai aur items stock mein wapas add ho chuke hain.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = index <= activeStep;
                            return (
                                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                                    <div
                                        className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                                            ? 'bg-black border-black text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        <Icon className="text-lg" />
                                    </div>
                                    <span className={`text-xs font-extrabold uppercase ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Items & Shipping Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                        Ordered Items ({order.items?.length})
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {order.items?.map((item, idx) => {
                            const imgUrl = (item.image || item.product?.productImages?.[0]?.url || 'https://via.placeholder.com/80').replace('http://', 'https://');
                            return (
                                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img src={imgUrl} alt={item.title} className="w-14 h-16 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                                        <div>
                                            <p className="text-xs font-black uppercase text-gray-900">{item.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                Qty: {item.quantity} × PKR {item.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-gray-900">
                                        PKR {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shipping & Payment Summary */}
                {/* <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                        <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
                            <FiMapPin /> Delivery Address
                        </h2>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p className="font-bold text-gray-900">{order.shippingAddress?.name}</p>
                            <p>{order.shippingAddress?.phoneNumber}</p>
                            <p>{order.shippingAddress?.address}</p>
                            <p className="font-semibold text-gray-800">{order.shippingAddress?.city}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                        <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                            Payment Summary
                        </h2>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Payment Method</span>
                            <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-xs font-black uppercase text-gray-900">Total Payable</span>
                            <span className="text-lg font-black text-gray-900">PKR {order.totalAmount?.toLocaleString()}</span>
                        </div>

                        {canCancel && (
                            <button
                                type="button"
                                disabled={isCancelling}
                                onClick={handleCancelOrder}
                                className="w-full mt-3 border border-red-300 text-red-600 hover:bg-red-50 font-extrabold text-[11px] uppercase py-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div> */}
                {/* Payment Summary */}
                {(() => {
                    const itemsSubtotal = order.items?.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    ) || 0;
                    const deliveryFee = Math.max(0, (order.totalAmount || 0) - itemsSubtotal);

                    return (
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                            <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                                Payment Summary
                            </h2>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-gray-600">
                                    <span>Payment Method</span>
                                    <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({order.items?.length} {order.items?.length === 1 ? 'item' : 'items'})</span>
                                    <span className="font-bold text-gray-900">PKR {itemsSubtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="font-bold text-gray-900">
                                        {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="text-xs font-black uppercase text-gray-900">Total Payable</span>
                                <span className="text-lg font-black text-gray-900">PKR {order.totalAmount?.toLocaleString()}</span>
                            </div>

                            {canCancel && (
                                <button
                                    type="button"
                                    disabled={isCancelling}
                                    onClick={handleCancelOrder}
                                    className="w-full mt-3 border border-red-300 text-red-600 hover:bg-red-50 font-extrabold text-[11px] uppercase py-2.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default OrderTrackingPage;