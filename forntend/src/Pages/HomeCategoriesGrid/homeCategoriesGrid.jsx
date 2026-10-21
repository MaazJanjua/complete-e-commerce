import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCategoriesQuery } from '../../redux/services/productApi'
import Button from '../../Components/ui/Button'

const HomeCategoriesGrid = () => {

    const navigate = useNavigate()

    //Data Fetching Logic: RTK Query or Fallback Data
    const { data, isLoading, isError, error } = useGetCategoriesQuery()

    //Backend Data Extraction: Safely access categories from API response / Backend Response Extraction
    const rawCategories = data?.data?.categories || data?.data || data;

    //Saftey Check (Array Guarantee): Ensure rawCategories is an array, else fallback to empty array
    const categoriesFromApi = Array.isArray(rawCategories) ? rawCategories : [];

    //FALLBACK DATA LOGIC: Default items in case DB empty or API fails
    const fallbackCategories = [
        { _id: 't-shirts', name: 'T-Shirts', slug: 't-shirts' },
        { _id: 'trousers', name: 'Trousers', slug: 'trousers' },
        { _id: 'pants', name: 'Pants', slug: 'pants' },
    ]

    //Final Decision: Use API data if available, else fallback to static data
    const displayCategories =
        categoriesFromApi.length > 0
            ? categoriesFromApi.slice(0, 5)
            : fallbackCategories;

    const handleCategoryNavigate = (category) => {
        const identifier = category.slug || category._id;
        navigate(`/category/${identifier}`)
    }

    return (


        <div className="w-full mx-auto min-h-125 lg:h-[60vh] sm:h-full md:h-[50vh] bg-white text-black font-bold py-6 ">
            <div className=' flex items-center flex-col text-2xl uppercase'><h1>Search By Category</h1></div>
            {/* Inner Flex Container */}
            <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-3 sm:gap-4 px-2 sm:px-4 h-full  rounded-lg overflow-hidden">
                {displayCategories.map((cat) => (
                    <div
                        key={cat._id}
                        onClick={() => handleCategoryNavigate(cat)}
                        style={{
                            backgroundImage: `url(${cat.image ||
                                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
                                })`
                        }}
                        /* Responsive Card Sizing:
                           Mobile: w-[85%] h-[250px]
                           Tablet (sm/md): w-[45%] md:w-[28%] h-[320px]
                           Large Screen (lg+): w-[18%] h-[80%] (80% ratio of parent)
                        */
                        className="relative overflow-hidden border-2 border-white/20 w-[85%] sm:w-[45%] md:w-[28%] lg:w-[18%] h-62.5 sm:h-80 lg:h-[80%] bg-cover bg-center bg-no-repeat cursor-pointer rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-md group shrink-0"
                    >
                        {/* Dark Readability Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-all duration-300 flex flex-col items-center justify-between p-4 sm:p-5 text-white">
                            <h3 className="text-xs sm:text-sm md:text-base uppercase tracking-wider text-center font-extrabold drop-shadow-md line-clamp-2">
                                {cat.name}
                            </h3>

                            {/* Reusable Button Component */}
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-2 text-[10px] sm:text-xs w-full border-white text-white hover:bg-white hover:text-black transition-all py-1.5"
                            >
                                Shop Now
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )


}

export default HomeCategoriesGrid
