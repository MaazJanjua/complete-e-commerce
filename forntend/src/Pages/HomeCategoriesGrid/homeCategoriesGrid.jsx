import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../redux/services/productApi';
import { FiArrowUpRight } from 'react-icons/fi';

const CATEGORY_FALLBACK_IMAGES = {
    't-shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    'shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    'trousers': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    'pants': 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
    'hoodies': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
};

const DEFAULT_FALLBACK =
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop';

const HomeCategoriesGrid = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetCategoriesQuery();

    const rawCategories = data?.data?.categories || data?.data || data;
    const categoriesFromApi = Array.isArray(rawCategories)
        ? rawCategories.filter((cat) => cat.isActive !== false)
        : [];

    const fallbackCategories = [
        { _id: 't-shirts', name: 'T-Shirts', slug: 't-shirts' },
        { _id: 'trousers', name: 'Trousers', slug: 'trousers' },
        { _id: 'pants', name: 'Pants', slug: 'pants' },
        { _id: 'hoodies', name: 'Hoodies', slug: 'hoodies' },
    ];

    const displayCategories =
        categoriesFromApi.length > 0
            ? categoriesFromApi.slice(0, 5)
            : fallbackCategories;

    const handleCategoryNavigate = (category) => {
        const identifier = category.slug || category._id;
        navigate(`/category/${identifier}`);
    };

    const getCategoryImage = (cat) => {
        const uploadedUrl = typeof cat.image === 'string' ? cat.image : cat.image?.url;
        if (uploadedUrl && uploadedUrl.trim() !== '') {
            return uploadedUrl.replace('http://', 'https://');
        }
        return CATEGORY_FALLBACK_IMAGES[cat.slug?.toLowerCase()] || DEFAULT_FALLBACK;
    };

    return (
        <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-10 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400">
                        Curated Collections
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
                        Search By Category
                    </h2>
                </div>

                {/* Loading Skeletons */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="h-80 sm:h-96 rounded-2xl bg-gray-100 animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    /* Responsive Categories Grid */
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 ${
                            displayCategories.length >= 5
                                ? 'lg:grid-cols-5'
                                : displayCategories.length === 4
                                ? 'lg:grid-cols-4'
                                : 'lg:grid-cols-3'
                        } gap-5`}
                    >
                        {displayCategories.map((cat) => (
                            <div
                                key={cat._id}
                                onClick={() => handleCategoryNavigate(cat)}
                                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Zoomable Image */}
                                <img
                                    src={getCategoryImage(cat)}
                                    alt={cat.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                                />

                                {/* Editorial Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/85 transition-colors duration-300" />

                                {/* Card Content */}
                                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white">
                                    {/* Top Pill */}
                                    <div className="flex justify-end">
                                        <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                            <FiArrowUpRight className="text-base" />
                                        </span>
                                    </div>

                                    {/* Bottom Title & CTA */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide drop-shadow-xs">
                                                {cat.name}
                                            </h3>
                                            {cat.description && (
                                                <p className="text-xs text-gray-200 line-clamp-1 mt-0.5 font-normal">
                                                    {cat.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full py-2.5 px-4 rounded-xl border border-white/70 bg-white/10 backdrop-blur-xs text-center text-[11px] font-extrabold uppercase tracking-widest group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                                            Explore Collection
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeCategoriesGrid;