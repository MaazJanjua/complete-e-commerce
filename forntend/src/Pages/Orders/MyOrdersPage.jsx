import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUserOrdersQuery } from '../../redux/services/productApi';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const MyOrdersPage = () => {
    const { data, isLoading, isError, error } = useGetUserOrdersQuery();
    const orders = data?.data || [];

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading Your Orders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm font-bold text-red-600">
                {error?.data?.message || 'Could not fetch orders'}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[65vh]">
            <div className="pb-6 border-b border-gray-200 mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">My Orders & Tracking</h1>
                <p className="text-xs text-gray-500 mt-1">Track your parcel status, view order items, or manage active orders.</p>
            </div>

            {orders.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <FiShoppingBag className="text-3xl text-gray-400 mx-auto" />
                    <h2 className="text-lg font-black uppercase text-gray-900">No Orders Yet</h2>
                    <p className="text-xs text-gray-500">Aap ne abhi tak koi order place nahi kiya.</p>
                    <Link
                        to="/"
                        className="inline-block mt-3 bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-lg"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            to={`/orders/${order._id}`}
                            className="block bg-white p-5 rounded-xl border border-gray-200 hover:border-black transition-all shadow-xs"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-gray-900">
                                            {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                                        </span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                                statusStyles[order.orderStatus] || statusStyles.pending
                                            }`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                                    </p>
                                    {order.trackingNumber && (
                                        <p className="text-[11px] font-bold text-purple-700 flex items-center gap-1 pt-0.5">
                                            <FiPackage /> Tracking ID: {order.trackingNumber}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                                    <div className="text-left sm:text-right">
                                        <span className="text-[10px] font-bold uppercase text-gray-400 block">Total (COD)</span>
                                        <span className="text-base font-black text-gray-900">PKR {order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <FiChevronRight className="text-gray-400 text-lg" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;