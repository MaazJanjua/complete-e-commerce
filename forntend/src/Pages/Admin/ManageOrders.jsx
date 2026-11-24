import React, { useState } from 'react';
import {
    useGetAllAdminOrdersQuery,
    useUpdateAdminOrderStatusMutation,
    useAddAdminOrderTrackingMutation
} from '../../redux/services/productApi';
import { FiPackage, FiTruck, FiSearch, FiEye, FiX, FiCheck } from 'react-icons/fi';


const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const NEXT_STATUS = {
    pending: 'confirmed',
    confirmed: 'shipped',
    shipped: 'delivered',
};

const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const ManageOrders = () => {
    const { data, isLoading, isError, error } = useGetAllAdminOrdersQuery();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminOrderStatusMutation();
    const [addTracking, { isLoading: isSavingTracking }] = useAddAdminOrderTrackingMutation();

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingInput, setTrackingInput] = useState('');

    const orders = data?.data || [];

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            (order.orderNumber || '').toLowerCase().includes(query) ||
            (order.shippingAddress?.name || '').toLowerCase().includes(query) ||
            (order.shippingAddress?.phoneNumber || '').includes(query);
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatus({ orderId, orderStatus: newStatus }).unwrap();
        } catch (err) {
            alert(err?.data?.message || 'Failed to update status');
        }
    };

    const handleSaveTracking = async (e) => {
        e.preventDefault();
        if (!selectedOrder || !trackingInput.trim()) return;
        try {
            const res = await addTracking({
                orderId: selectedOrder._id,
                trackingNumber: trackingInput
            }).unwrap();
            setSelectedOrder(res?.data || selectedOrder);
            setTrackingInput('');
        } catch (err) {
            alert(err?.data?.message || 'Failed to save tracking number');
        }
    };

    if (isLoading) {
        return (
            <div className="py-24 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold uppercase text-gray-500">Loading Customer Orders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                {error?.data?.message || 'Failed to fetch orders'}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Manage Orders</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Confirm COD orders, assign courier tracking IDs, and update delivery status.</p>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-72">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search Order #, Name or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', ...STATUS_OPTIONS].map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${statusFilter === status
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                <th className="py-3.5 px-4">Order #</th>
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Total (COD)</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Tracking ID</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400 font-bold">
                                        No orders match this filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="py-3.5 px-4 font-black text-gray-900">
                                            {order.orderNumber}
                                            <span className="block text-[10px] font-normal text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('en-PK')}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <p className="font-bold text-gray-900">{order.shippingAddress?.name}</p>
                                            <p className="text-[11px] text-gray-500">{order.shippingAddress?.city} • {order.shippingAddress?.phoneNumber}</p>
                                        </td>

                                        <td className="py-3.5 px-4 font-black text-gray-900">
                                            PKR {order.totalAmount?.toLocaleString()}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <select
                                                disabled={isUpdatingStatus || !NEXT_STATUS[order.orderStatus]}
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase border cursor-pointer focus:outline-none ${statusColors[order.orderStatus] || statusColors.pending
                                                    }`}
                                            >
                                                <option value={order.orderStatus}>{order.orderStatus}</option>
                                                {NEXT_STATUS[order.orderStatus] && (
                                                    <option value={NEXT_STATUS[order.orderStatus]}>
                                                        Move to → {NEXT_STATUS[order.orderStatus]}
                                                    </option>
                                                )}
                                            </select>
                                        </td>



                                        <td className="py-3.5 px-4">
                                            {order.trackingNumber ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                                                    <FiTruck /> {order.trackingNumber}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-gray-400 italic">Not assigned</span>
                                            )} 
                                        </td>

                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setTrackingInput(order.trackingNumber || '');
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-bold uppercase rounded-lg hover:bg-gray-700 cursor-pointer"
                                            >
                                                <FiEye /> Details / Track
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details & Tracking Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase text-gray-400">Order Details</span>
                                <h3 className="text-lg font-black text-gray-900">{selectedOrder.orderNumber}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 text-gray-400 hover:text-black rounded-lg"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        {/* Assign Courier Tracking Number Form */}
                        <form onSubmit={handleSaveTracking} className="bg-purple-50/70 border border-purple-100 p-4 rounded-xl space-y-2.5">
                            <label className="block text-[11px] font-extrabold uppercase text-purple-900">
                                Assign Courier Tracking Number (Auto-sets status to Shipped)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. TCS-89432109"
                                    value={trackingInput}
                                    onChange={(e) => setTrackingInput(e.target.value)}
                                    className="flex-1 bg-white border border-purple-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-600"
                                />
                                <button
                                    type="submit"
                                    disabled={isSavingTracking}
                                    className="bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-extrabold uppercase hover:bg-purple-800 flex items-center gap-1 cursor-pointer"
                                >
                                    <FiCheck /> {isSavingTracking ? '...' : 'Save'}
                                </button>
                            </div>
                        </form>

                        {/* Ordered Items */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-extrabold uppercase text-gray-500">Items Ordered</h4>
                            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl p-3">
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="py-2 first:pt-0 last:pb-0 flex justify-between text-xs">
                                        <span className="font-bold text-gray-800">
                                            {item.title} <span className="text-gray-400">× {item.quantity}</span>
                                        </span>
                                        <span className="font-black text-gray-900">
                                            PKR {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 p-3.5 rounded-xl text-xs space-y-1 text-gray-600">
                            <p className="font-black text-gray-900 uppercase text-[10px]">Delivery Address</p>
                            <p className="font-bold text-gray-800">{selectedOrder.shippingAddress?.name} ({selectedOrder.shippingAddress?.phoneNumber})</p>
                            <p>{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;