import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    FiGrid,
    FiBox,
    FiFolderPlus,
    FiShoppingBag,
    FiLogOut,
    FiMenu,
    FiX,
    FiHome
} from 'react-icons/fi'

const AdminLayout = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()

    const navLinks = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
        { name: "Manage Products", path: "/admin/products", icon: <FiBox /> },
        { name: "Add Product", path: "/admin/products/create", icon: <FiFolderPlus /> },
        { name: "Categories", path: "/admin/categories", icon: <FiShoppingBag /> }
    ]

    const isActive = (path) => location.pathname === path;

    return (
        <div className='min-h-screen bg-gray-100 flex'>
            {/* Sidebar OverLay for mobile */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)}
                    className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                >
                </div>
            )}
            {/* Sidebar Navigation */}
            {/* Sidebar Navigation */}
            <aside
                className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-black text-white flex flex-col justify-between transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div>
                    {/* Brand Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                        <Link to="/admin/dashboard" className="text-xl font-extrabold uppercase tracking-widest text-white">
                            HM. <span className="text-gray-400">ADMIN</span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${isActive(link.path)
                                    ? 'bg-white text-black shadow-md'
                                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                    }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-all"
                    >
                        <FiHome className="text-lg" />
                        Back to Storefront
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <FiMenu className="text-2xl" />
                    </button>

                    <h1 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-wider">
                        Admin Control Center
                    </h1>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full uppercase">
                            Admin Role
                        </span>
                    </div>
                </header>

                {/* Dynamic Page Content Render via Outlet */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
