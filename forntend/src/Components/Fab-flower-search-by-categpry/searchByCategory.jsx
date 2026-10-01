// src/Components/home/SearchByCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../redux/services/productApi';

const SearchByCategory = () => {
  const navigate = useNavigate();

  // 1. Open/Close State
  const [isOpen, setIsOpen] = useState(false);

  // RTK Query: Dynamic Categories Fetch
  const { data, isLoading, isError } = useGetCategoriesQuery();

  const rawData = data?.data?.categories || data?.data || data;
  const categories = Array.isArray(rawData) ? rawData : [];

  const handleCategoryClick = (categoryId) => {
    setIsOpen(false); // Sub-button click hone par menu band ho jaye
    navigate(`/category/${categoryId}`);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 
        2. DYNAMIC DAISYUI CLASS FIX:
        Agar isOpen true hai, tabhi 'fab-active' class lagegi. 
        Agar isOpen false hoga, toh sub-buttons (Categories) CSS se completely hide ho jayenge!
      */}
      <div className={`fab fab-flower ${isOpen ? 'fab-active' : ''}`}>

        {/* Main Trigger Button */}
        <button
          type="button"
          onClick={toggleMenu}
          className="btn btn-lg btn-circle btn-neutral relative overflow-visible shadow-xl border-2 border-white/20 hover:scale-105 transition-all duration-300"
          aria-expanded={isOpen}
          aria-label="Toggle Search by Category"
        >
          {/* Rectangular Badge Label */}
          {/* When isOpen is true, badge smoothly hides */}
          <span
            className={`absolute right-12 pr-10 pl-5 py-2.5 bg-gray-900 text-white text-xs font-bold tracking-wider uppercase rounded-full border border-gray-700 shadow-xl whitespace-nowrap -z-10 transition-all duration-300 ${
              isOpen
                ? 'opacity-0 scale-95 pointer-events-none translate-x-2'
                : 'opacity-100 scale-100 translate-x-0'
            }`}
          >
            Search By Category
          </span>

          {/* Dynamic Search / Close Cross Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 relative z-10 text-white transition-transform duration-300 ${
              isOpen ? 'rotate-90 scale-110' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              /* Close Cross Icon (X) */
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              /* Search Icon */
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
        </button>

        {/* Sub Floating Buttons (Categories Container) */}
        {/* 
          3. CONDITIONAL RENDERING SAFETY:
          Agar isOpen true hai, TABHI sub-buttons DOM me active honge!
        */}
        {isOpen && (
          <>
            {isLoading ? (
              <button className="btn btn-circle h-16 w-16 text-[10px] bg-neutral text-white font-semibold">
                Loading...
              </button>
            ) : isError || categories.length === 0 ? (
              /* Fallback Static Buttons */
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/Shirts');
                  }}
                  className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
                >
                  T-Shirts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/trousers');
                  }}
                  className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
                >
                  Trousers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/pants');
                  }}
                  className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md"
                >
                  Pants
                </button>
              </>
            ) : (
              /* Dynamic DB Categories */
              categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleCategoryClick(cat._id)}
                  className="btn btn-circle h-16 w-16 text-xs bg-neutral text-white font-bold tracking-wider hover:bg-black uppercase border border-gray-700 shadow-md transition-all"
                >
                  <span className="truncate px-1 text-[11px] font-extrabold">{cat.name}</span>
                </button>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default SearchByCategory;