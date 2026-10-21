import React from 'react'
import { useNavigate } from "react-router-dom"
import Button from '../../Components/ui/Button'



const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    //safe extraction for cloudinary images or fallback
    const productImage = product?.images?.[0] || product?.image || 'https://via.placeholder.com/300x400?text=No+Image';

    const handleCardClick = () => {
        navigate(`/product/${product?._id}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation();
        console.log("added to cart", product?._id);

    }

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            {/* Image container */}
            <div className="relative w-full aspect-3/4 bg-gray-100 overflow-hidden">
                <img src={productImage} alt={product?.name || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Stock Badge */}
                {product?.stock <= 0 && (
                    <span className='absolute top-2 right-2 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded'>Out of Stock</span>
                )}
            </div>

            {/* PRODUCT DETAILs */}
            <div className='p-4 flex flex-col grow justify-between text-left'>
                <div>
                    <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                        {product?.category?.name || "Clothing"}
                    </span>
                </div>
                <h3 className='text-sm font-bold text-gray-900 uppercase tracking-tight truncate mt-1'>{product?.name || 'Untitled Product'}

                </h3>

            </div>

            <div className='flex flex-col items-center'>
                <span>
                    PKR - <span className='text-blue-700'>  {product?.price ? product.price.toLocaleString() : '0'} </span>
                </span>

                <Button
                    type="button"
                    onClick={handleAddToCart}
                    variant="Outline"
                    className="w-auto! py-1! px-3! text-xs border rounded my-2 border-black! hover:bg-black! hover:text-white!"
                >
                    Add To Cart
                </Button>
            </div>

        </div>
    )
}

export default ProductCard
