import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux/services/productApi';
import ProductCard from '../../Components/common/ProductCard.jsx'; 
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const CategoryProducts = () => {
    const { slug } = useParams(); // URL se 'hoodies', 't-shirts' etc. milega
    const [sort, setSort] = useState('newest');

    // Backend ko category slug aur sort parameter bhejna
    const { data, isLoading, isError, error } = useGetProductsQuery({
        category: slug,
        sort,
    });

    const products = data?.data?.products || [];
    const totalProducts = data?.data?.pagination?.totalProducts || products.length;

    // Slug ko clean heading mein convert karna (e.g., 't-shirts' -> 'T-SHIRTS')
    const formattedTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CATEGORY';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
            {/* Breadcrumb & Back Link */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
                >
                    <FiArrowLeft /> Back to Home
                </Link>
            </div>

            {/* Category Header & Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
                <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                        Collection
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mt-1">
                        {formattedTitle}
                    </h1>
                    {!isLoading && (
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Showing {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                        </p>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-400 text-sm" />
                    <label htmlFor="sort" className="text-xs font-bold uppercase text-gray-500">
                        Sort by:
                    </label>
                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="text-xs font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black cursor-pointer"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Loading {formattedTitle}...
                    </p>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 text-sm font-medium">
                    {error?.data?.message || 'Failed to load category products.'}
                </div>
            )}

            {/* Empty State (Agar is category mein koi product na ho) */}
            {!isLoading && !isError && products.length === 0 && (
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 uppercase">
                        No Products Found in {formattedTitle}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                        Abhi is category mein koi product list nahi hai. Jald hi naye items add kiye jayenge!
                    </p>
                    <Link
                        to="/"
                        className="inline-block mt-6 bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Explore All Products
                    </Link>
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && !isError && products.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;