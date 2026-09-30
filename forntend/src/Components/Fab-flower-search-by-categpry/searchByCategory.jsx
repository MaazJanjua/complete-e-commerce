// import React from 'react'

// const SearchByCategory = () => {
//     return (
//         <div>
//             <div className="fab fab-flower">
//                 {/* 1. Main Trigger Element (tabIndex={0} and btn are required for DaisyUI FAB) */}
//                 <div 
//                     tabIndex={0} 
//                     role="button" 
//                     className="btn btn-lg btn-circle btn-neutral relative overflow-visible shadow-lg"
//                 >
//                     {/* Rectangular Badge / Bubble (Circle ke peeche attach rahega) */}
//                     <span className="absolute right-12 pr-10 pl-5 py-2.5 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full  border border-gray-300 shadow-md whitespace-nowrap -z-10 pointer-events-none">
//                         Search By Category
//                     </span>

//                     {/* Circle Icon */}
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                 </div>

//                 {/* 2. Sub buttons (Click karne par ye buttons show honge) */}
//                 <button className="btn btn-lg btn-circle h-20 w-20 text-sm">T-Shirts</button>
//                 <button className="btn btn-lg btn-circle h-20 w-20 text-sm">Trousers</button>
//                 <button className="btn btn-lg btn-circle h-20 w-20 text-sm">Pants</button>
//             </div>
//         </div>
//     )
// }

// export default SearchByCategory

// src/Components/home/SearchByCategory.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../redux/services/productApi';

const SearchByCategory = () => {
  const navigate = useNavigate();

  // RTK Query: Backend se Dynamic Categories fetch kar rahe hain
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = data?.data || [];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="fab fab-flower">
        
        {/* 1. Main Trigger Element */}
        <div
          tabIndex={0}
          role="button"
          className="btn btn-lg btn-circle btn-neutral relative overflow-visible shadow-xl border-2 border-white/20 hover:scale-105 transition-transform"
        >
          {/* Rectangular Badge / Bubble */}
          <span className="absolute right-12 pr-10 pl-5 py-2.5 bg-gray-900 text-white text-xs font-bold tracking-wider uppercase rounded-full border border-gray-700 shadow-xl whitespace-nowrap -z-10 pointer-events-none">
            Search By Category
          </span>

          {/* Circle Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 relative z-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 2. Sub buttons (Dynamic Categories from Database) */}
        {isLoading ? (
          <button className="btn btn-circle h-16 w-16 text-[10px] bg-black text-white font-semibold">
            Loading...
          </button>
        ) : isError || categories.length === 0 ? (
          /* Fallback static buttons agar database khali ho ya API error ho */
          <>
            <button
              onClick={() => navigate('/Shirts')}
              className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
            >
              T-Shirts
            </button>
            <button
              onClick={() => navigate('/trousers')}
              className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
            >
              Trousers
            </button>
            <button
              onClick={() => navigate('/pants')}
              className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
            >
              Pants
            </button>
          </>
        ) : (
          /* Dynamic Sub Buttons from MongoDB */
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md transition-all"
              title={cat.name}
            >
              <span className="truncate px-1 text-[11px] font-extrabold">{cat.name}</span>
            </button>
          ))
        )}

      </div>
    </div>
  );
};

export default SearchByCategory;