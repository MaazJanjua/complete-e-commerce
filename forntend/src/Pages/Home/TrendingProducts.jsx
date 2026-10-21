import React from 'react'
import { useGetProductsQuery } from '../../redux/services/productApi'
import ProductCard from '../../Components/common/ProductCard';

const TrendingProducts = () => {
    //Fetching Product with limit param
    const { data, isLoading, isError } = useGetProductsQuery({ limit: 8 });

    //Safe data Normalization
    const rawProducts = data?.data?.products || data?.data || data;
    const productsFromApi = Array.isArray(rawProducts) ? rawProducts : [];
    const fallbackProducts = [
        {
            _id: '1',
            name: 'Oversized Vintage Hoodie',
            price: 3499,
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
            category: { name: 'Hoodies' }
        },
        {
            _id: '2',
            name: 'Graphic Heavyweight Tee',
            price: 1899,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
            category: { name: 'T-Shirts' }
        },
        {
            _id: '3',
            name: 'Cargo Fit Utility Pants',
            price: 2999,
            image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
            category: { name: 'Pants' }
        },
        {
            _id: '4',
            name: 'Classic Bomber Jacket',
            price: 4999,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
            category: { name: 'Jackets' }
        },
    ]
    const displayProducts = productsFromApi.length > 0 ? productsFromApi : fallbackProducts

    if (isLoading) {
        return (
            <section className="max-w-[89vw] mx-auto px-4 py-12">
                <h2 className="text-base font-extrabold tracking-[0.2em] text-center uppercase mb-8">
                    TRENDING NOW
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="aspect-3/4 bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                </div>
            </section>
        )
    }
    return (
        <section className="max-w-[89vw] mx-auto px-4 py-12">
            <h2 className="text-base md:text-lg font-extrabold tracking-[0.2em] text-center uppercase mb-8 text-black">
                TRENDING NOW
            </h2>
            {/* Responsive Grid Layout */}
            <div className='grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-black '>
                {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default TrendingProducts
