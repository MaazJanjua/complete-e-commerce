// // import React from 'react';
// // import { useGetAdminStatsQuery } from '../../redux/services/productApi';
// // import {
// //     FiDollarSign,
// //     FiShoppingBag,
// //     FiPackage,
// //     FiUsers,
// //     FiAlertTriangle,
// //     FiClock,
// //     FiPlus,
// //     FiArrowRight
// // } from 'react-icons/fi';
// // import { Link } from 'react-router-dom';

// // const AdminDashboard = () => {
// //     const { data: statsData, isLoading, isError, error } = useGetAdminStatsQuery();

// //     const stats = statsData?.data || {};

// //     if (isLoading) {
// //         return (
// //             <div className="max-w-6xl mx-auto p-8 text-center">
// //                 <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
// //                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
// //                     Loading Analytics Dashboard...
// //                 </p>
// //             </div>
// //         );
// //     }

// //     if (isError) {
// //         return (
// //             <div className="max-w-6xl mx-auto p-6">
// //                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
// //                     Error loading dashboard stats: {error?.data?.message || 'Server connection issue'}
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
// //             {/* Top Header */}
// //             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //                 <div>
// //                     <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
// //                         Overview Dashboard
// //                     </h1>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                         Real-time performance metrics and inventory status for your store.
// //                     </p>
// //                 </div>

// //                 <div className="flex gap-2">
// //                     <Link
// //                         to="/admin/products/create"
// //                         className="bg-black text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1.5 shadow-xs"
// //                     >
// //                         <FiPlus /> Add Product
// //                     </Link>
// //                 </div>
// //             </div>

// //             {/* Metric Cards Grid */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
// //                 {/* Total Revenue */}
// //                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
// //                     <div className="flex items-center justify-between">
// //                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
// //                             Total Revenue
// //                         </span>
// //                         <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
// //                             <FiDollarSign className="text-lg" />
// //                         </div>
// //                     </div>
// //                     <p className="text-2xl font-black text-gray-900">
// //                         PKR {stats.totalRevenue?.toLocaleString() || '0'}
// //                     </p>
// //                     <span className="text-[11px] font-semibold text-green-600">
// //                         Verified Payments
// //                     </span>
// //                 </div>

// //                 {/* Total Orders */}
// //                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
// //                     <div className="flex items-center justify-between">
// //                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
// //                             Total Orders
// //                         </span>
// //                         <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
// //                             <FiShoppingBag className="text-lg" />
// //                         </div>
// //                     </div>
// //                     <p className="text-2xl font-black text-gray-900">
// //                         {stats.totalOrders || 0}
// //                     </p>
// //                     <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
// //                         <FiClock /> {stats.pendingOrdersCount || 0} Pending
// //                     </span>
// //                 </div>

// //                 {/* Total Products */}
// //                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
// //                     <div className="flex items-center justify-between">
// //                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
// //                             Active Inventory
// //                         </span>
// //                         <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700">
// //                             <FiPackage className="text-lg" />
// //                         </div>
// //                     </div>
// //                     <p className="text-2xl font-black text-gray-900">
// //                         {stats.totalProducts || 0}
// //                     </p>
// //                     {stats.lowStockProducts > 0 ? (
// //                         <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
// //                             <FiAlertTriangle /> {stats.lowStockProducts} Low Stock
// //                         </span>
// //                     ) : (
// //                         <span className="text-[11px] font-semibold text-gray-400">
// //                             Stock Levels Healthy
// //                         </span>
// //                     )}
// //                 </div>

// //                 {/* Total Customers */}
// //                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
// //                     <div className="flex items-center justify-between">
// //                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
// //                             Registered Users
// //                         </span>
// //                         <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-700">
// //                             <FiUsers className="text-lg" />
// //                         </div>
// //                     </div>
// //                     <p className="text-2xl font-black text-gray-900">
// //                         {stats.totalUsers || 0}
// //                     </p>
// //                     <span className="text-[11px] font-semibold text-gray-400">
// //                         Active Accounts
// //                     </span>
// //                 </div>
// //             </div>

// //             {/* Recent Orders Section */}
// //             <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-4">
// //                 <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
// //                     <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
// //                         Recent Store Orders
// //                     </h2>
// //                     <span className="text-xs text-gray-400 font-semibold">
// //                         Latest 5 Transactions
// //                     </span>
// //                 </div>

// //                 {!stats.recentOrders || stats.recentOrders.length === 0 ? (
// //                     <div className="p-8 text-center text-xs text-gray-400 font-medium">
// //                         No orders placed yet.
// //                     </div>
// //                 ) : (
// //                     <div className="overflow-x-auto">
// //                         <table className="w-full text-left border-collapse">
// //                             <thead>
// //                                 <tr className="border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
// //                                     <th className="py-3 px-5">Order ID</th>
// //                                     <th className="py-3 px-5">Customer</th>
// //                                     <th className="py-3 px-5">Status</th>
// //                                     <th className="py-3 px-5">Amount</th>
// //                                     <th className="py-3 px-5">Date</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody className="divide-y divide-gray-100 text-xs">
// //                                 {stats.recentOrders.map((order) => (
// //                                     <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
// //                                         <td className="py-3.5 px-5 font-bold text-gray-900">
// //                                             #{order._id?.slice(-6)?.toUpperCase()}
// //                                         </td>
// //                                         <td className="py-3.5 px-5">
// //                                             <p className="font-bold text-gray-800">
// //                                                 {order.user?.fullName || 'Guest Customer'}
// //                                             </p>
// //                                             <p className="text-[10px] text-gray-400">
// //                                                 {order.user?.email || 'N/A'}
// //                                             </p>
// //                                         </td>
// //                                         <td className="py-3.5 px-5">
// //                                             <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${order.orderStatus === 'delivered'
// //                                                     ? 'bg-green-50 text-green-700'
// //                                                     : order.orderStatus === 'cancelled'
// //                                                         ? 'bg-red-50 text-red-700'
// //                                                         : 'bg-amber-50 text-amber-700'
// //                                                 }`}>
// //                                                 {order.orderStatus}
// //                                             </span>
// //                                         </td>
// //                                         <td className="py-3.5 px-5 font-bold text-gray-900">
// //                                             PKR {order.totalAmount?.toLocaleString()}
// //                                         </td>
// //                                         <td className="py-3.5 px-5 text-gray-400">
// //                                             {new Date(order.createdAt).toLocaleDateString()}
// //                                         </td>
// //                                     </tr>
// //                                 ))}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 )}
// //             </div>



// //         </div>
// //     );
// // };

// // export default AdminDashboard;




// import React from 'react';
// import { useGetAdminStatsQuery } from '../../redux/services/productApi';
// import {
//     FiDollarSign,
//     FiShoppingBag,
//     FiPackage,
//     FiUsers,
//     FiAlertTriangle,
//     FiClock,
//     FiPlus,
//     FiFolder
// } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// const AdminDashboard = () => {
//     const { data: statsData, isLoading, isError, error } = useGetAdminStatsQuery();

//     const stats = statsData?.data || {};

//     if (isLoading) {
//         return (
//             <div className="max-w-6xl mx-auto p-8 text-center">
//                 <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                     Loading Analytics Dashboard...
//                 </p>
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="max-w-6xl mx-auto p-6">
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
//                     Error loading dashboard stats: {error?.data?.message || 'Server connection issue'}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
//             {/* Top Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
//                         Overview Dashboard
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         Real-time performance metrics and inventory status for your store.
//                     </p>
//                 </div>

//                 <div className="flex gap-2">
//                     <Link
//                         to="/admin/products/create"
//                         className="bg-black text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1.5 shadow-xs"
//                     >
//                         <FiPlus /> Add Product
//                     </Link>
//                 </div>
//             </div>

//             {/* Expanded 6-Metric Cards Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {/* 1. Total Revenue */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Total Revenue
//                         </span>
//                         <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
//                             <FiDollarSign className="text-lg" />
//                         </div>
//                     </div>
//                     <p className="text-2xl font-black text-gray-900">
//                         PKR {stats.totalRevenue?.toLocaleString() || '0'}
//                     </p>
//                     <span className="text-[11px] font-semibold text-green-600">
//                         Verified Payments
//                     </span>
//                 </div>

//                 {/* 2. Total Orders */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Total Orders
//                         </span>
//                         <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
//                             <FiShoppingBag className="text-lg" />
//                         </div>
//                     </div>
//                     <p className="text-2xl font-black text-gray-900">
//                         {stats.totalOrders || 0}
//                     </p>
//                     <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
//                         <FiClock /> {stats.pendingOrdersCount || 0} Pending
//                     </span>
//                 </div>

//                 {/* 3. Total Products */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Active Products
//                         </span>
//                         <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700">
//                             <FiPackage className="text-lg" />
//                         </div>
//                     </div>
//                     <p className="text-2xl font-black text-gray-900">
//                         {stats.totalProducts || 0}
//                     </p>
//                     <span className="text-[11px] font-semibold text-purple-600">
//                         Listed in Catalog
//                     </span>
//                 </div>

//                 {/* 4. Total Categories */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Categories
//                         </span>
//                         <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700">
//                             <FiFolder className="text-lg" />
//                         </div>
//                     </div>
//                     <p className="text-2xl font-black text-gray-900">
//                         {stats.totalCategories || 0}
//                     </p>
//                     <span className="text-[11px] font-semibold text-indigo-600">
//                         Store Taxonomy
//                     </span>
//                 </div>

//                 {/* 5. Low Stock Alert */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Low Stock Alerts
//                         </span>
//                         <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
//                             <FiAlertTriangle className="text-lg" />
//                         </div>
//                     </div>
//                     <p className="text-2xl font-black text-gray-900">
//                         {stats.lowStockProducts || 0}
//                     </p>
//                     {stats.lowStockProducts > 0 ? (
//                         <span className="text-[11px] font-bold text-red-600">
//                             Items Need Restocking
//                         </span>
//                     ) : (
//                         <span className="text-[11px] font-semibold text-gray-400">
//                             Inventory Healthy
//                         </span>
//                     )}
//                 </div>

//                 {/* 6. Registered Users (With Role Breakdown) */}
//                 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
//                             Registered Users
//                         </span>
//                         <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-700">
//                             <FiUsers className="text-lg" />
//                         </div>
//                     </div>

//                     <p className="text-2xl font-black text-gray-900">
//                         {stats.totalUsers || 0}
//                     </p>

//                     {/* Role Breakdown Badges */}
//                     <div className="flex items-center gap-2 pt-0.5 text-[11px] font-bold">
//                         <span className="bg-black text-white px-2 py-0.5 rounded-md">
//                             {stats.adminUsers || 0} Admins
//                         </span>
//                         <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
//                             {stats.normalUsers || 0} Users
//                         </span>
//                     </div>
//                 </div>


//             </div>

//             {/* Recent Orders Section */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-4">
//                 <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
//                     <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
//                         Recent Store Orders
//                     </h2>
//                     <span className="text-xs text-gray-400 font-semibold">
//                         Latest 5 Transactions
//                     </span>
//                 </div>

//                 {!stats.recentOrders || stats.recentOrders.length === 0 ? (
//                     <div className="p-8 text-center text-xs text-gray-400 font-medium">
//                         No orders placed yet.
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
//                                     <th className="py-3 px-5">Order ID</th>
//                                     <th className="py-3 px-5">Customer</th>
//                                     <th className="py-3 px-5">Status</th>
//                                     <th className="py-3 px-5">Amount</th>
//                                     <th className="py-3 px-5">Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100 text-xs">
//                                 {stats.recentOrders.map((order) => (
//                                     <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
//                                         <td className="py-3.5 px-5 font-bold text-gray-900">
//                                             #{order._id?.slice(-6)?.toUpperCase()}
//                                         </td>
//                                         <td className="py-3.5 px-5">
//                                             <p className="font-bold text-gray-800">
//                                                 {order.user?.fullName || 'Guest Customer'}
//                                             </p>
//                                             <p className="text-[10px] text-gray-400">
//                                                 {order.user?.email || 'N/A'}
//                                             </p>
//                                         </td>
//                                         <td className="py-3.5 px-5">
//                                             <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${order.orderStatus === 'delivered'
//                                                 ? 'bg-green-50 text-green-700'
//                                                 : order.orderStatus === 'cancelled'
//                                                     ? 'bg-red-50 text-red-700'
//                                                     : 'bg-amber-50 text-amber-700'
//                                                 }`}>
//                                                 {order.orderStatus}
//                                             </span>
//                                         </td>
//                                         <td className="py-3.5 px-5 font-bold text-gray-900">
//                                             PKR {order.totalAmount?.toLocaleString()}
//                                         </td>
//                                         <td className="py-3.5 px-5 text-gray-400">
//                                             {new Date(order.createdAt).toLocaleDateString()}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;




import React, { useState } from 'react';
import { useGetAdminStatsQuery } from '../../redux/services/productApi';
import {
    FiDollarSign,
    FiShoppingBag,
    FiPackage,
    FiUsers,
    FiAlertTriangle,
    FiClock,
    FiPlus,
    FiFolder,
    FiX,
    FiArrowUpRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { data: statsData, isLoading, isError, error } = useGetAdminStatsQuery();
    const [showLowStockModal, setShowLowStockModal] = useState(false);

    const stats = statsData?.data || {};
    const lowStockList = stats.lowStockItems || [];

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Loading Analytics Dashboard...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                    Error loading dashboard stats: {error?.data?.message || 'Server connection issue'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                        Overview Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time performance metrics and inventory status for your store.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to="/admin/products/create"
                        className="bg-black text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1.5 shadow-xs"
                    >
                        <FiPlus /> Add Product
                    </Link>
                </div>
            </div>

            {/* Expanded 6-Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Total Revenue */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Total Revenue
                        </span>
                        <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-700">
                            <FiDollarSign className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        PKR {stats.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <span className="text-[11px] font-semibold text-green-600">
                        Verified Payments
                    </span>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Total Orders
                        </span>
                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700">
                            <FiShoppingBag className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {stats.totalOrders || 0}
                    </p>
                    <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                        <FiClock /> {stats.pendingOrdersCount || 0} Pending
                    </span>
                </div>

                {/* 3. Total Products */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Active Products
                        </span>
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700">
                            <FiPackage className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {stats.totalProducts || 0}
                    </p>
                    <span className="text-[11px] font-semibold text-purple-600">
                        Listed in Catalog
                    </span>
                </div>

                {/* 4. Total Categories */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Categories
                        </span>
                        <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700">
                            <FiFolder className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {stats.totalCategories || 0}
                    </p>
                    <span className="text-[11px] font-semibold text-indigo-600">
                        Store Taxonomy
                    </span>
                </div>

                {/* 5. Low Stock Alert (CLICKABLE CARD) */}
                <div
                    onClick={() => lowStockList.length > 0 && setShowLowStockModal(true)}
                    className={`bg-white p-5 rounded-xl border shadow-xs space-y-2 transition-all ${
                        lowStockList.length > 0
                            ? 'border-red-200 hover:border-red-400 hover:shadow-md cursor-pointer'
                            : 'border-gray-200'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Low Stock Alerts
                        </span>
                        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <FiAlertTriangle className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {stats.lowStockProducts || 0}
                    </p>
                    {lowStockList.length > 0 ? (
                        <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[11px] font-bold text-red-600">
                                Items Need Restocking
                            </span>
                            <span className="text-[10px] font-extrabold uppercase text-red-700 bg-red-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                                View Items <FiArrowUpRight />
                            </span>
                        </div>
                    ) : (
                        <span className="text-[11px] font-semibold text-gray-400">
                            Inventory Healthy
                        </span>
                    )}
                </div>

                {/* 6. Registered Users */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            Registered Users
                        </span>
                        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-700">
                            <FiUsers className="text-lg" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {stats.totalUsers || 0}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] font-bold">
                        <span className="bg-black text-white px-2 py-0.5 rounded-md">
                            {stats.adminUsers || 0} Admins
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            {stats.normalUsers || 0} Users
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-4">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                        Recent Store Orders
                    </h2>
                    <span className="text-xs text-gray-400 font-semibold">
                        Latest 5 Transactions
                    </span>
                </div>

                {!stats.recentOrders || stats.recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 font-medium">
                        No orders placed yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                                    <th className="py-3 px-5">Order ID</th>
                                    <th className="py-3 px-5">Customer</th>
                                    <th className="py-3 px-5">Status</th>
                                    <th className="py-3 px-5">Amount</th>
                                    <th className="py-3 px-5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="py-3.5 px-5 font-bold text-gray-900">
                                            #{order._id?.slice(-6)?.toUpperCase()}
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <p className="font-bold text-gray-800">
                                                {order.user?.fullName || 'Guest Customer'}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {order.user?.email || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                                order.orderStatus === 'delivered'
                                                    ? 'bg-green-50 text-green-700'
                                                    : order.orderStatus === 'cancelled'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 font-bold text-gray-900">
                                            PKR {order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-5 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* LOW STOCK ITEMS MODAL */}
            {showLowStockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700">
                                <FiAlertTriangle className="text-lg" />
                                <h3 className="text-sm font-black uppercase tracking-wider">
                                    Low Stock Inventory ({lowStockList.length})
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowLowStockModal(false)}
                                className="p-1.5 rounded-lg text-red-700 hover:bg-red-100 transition-colors"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        {/* Modal Body - List of Low Stock Items */}
                        <div className="p-6 max-h-80 overflow-y-auto divide-y divide-gray-100">
                            {lowStockList.map((item) => {
                                const thumb = item?.productImages?.[0]?.url?.replace("http://", "https://") || "https://via.placeholder.com/80";
                                return (
                                    <div key={item._id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={thumb}
                                                alt={item.title}
                                                className="w-11 h-12 rounded-lg object-cover border border-gray-200 bg-gray-50 shrink-0"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 line-clamp-1">
                                                    {item.title}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">
                                                    {item.category?.name || 'Uncategorized'} • PKR {item.price?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                                item.stock === 0
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {item.stock === 0 ? 'Out of Stock' : `${item.stock} Left`}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowLowStockModal(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                            >
                                Close
                            </button>
                            <Link
                                to="/admin/products"
                                onClick={() => setShowLowStockModal(false)}
                                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Go to Manage Products
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;