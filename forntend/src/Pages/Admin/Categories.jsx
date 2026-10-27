import React, { useState } from 'react';
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useDeleteCategoryMutation 
} from '../../redux/services/productApi';
import { FiPlus, FiTrash2, FiGrid } from 'react-icons/fi';

const Categories = () => {
  const { data: categoryData, isLoading, isError, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [categoryName, setCategoryName] = useState('');

  // Safe Data Extraction
  const rawCategories = categoryData?.data?.categories || categoryData?.data || categoryData;
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : [];

  // Create Category Handler
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await createCategory({ name: categoryName.trim() }).unwrap();
      setCategoryName('');
      alert('Category created successfully!');
    } catch (err) {
      console.error('Failed to create category:', err);
      alert(err?.data?.message || 'Failed to create category.');
    }
  };

  // Delete Category Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory(id).unwrap();
        alert('Category deleted successfully!');
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert(err?.data?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
          Categories Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, view, and remove product categories for your catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider flex items-center gap-2">
              <FiPlus /> Add Category
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Hoodies, Accessories"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !categoryName.trim()}
                className="w-full bg-black text-white font-bold text-xs py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Category</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <FiGrid /> Existing Categories ({categoriesList.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Loading categories...</p>
              </div>
            ) : isError ? (
              <div className="p-4 text-xs text-red-600 bg-red-50">
                Failed to load categories: {error?.data?.message || 'Server Error'}
              </div>
            ) : categoriesList.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No categories created yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categoriesList.map((cat, index) => {
                  const id = cat._id || cat;
                  const name = cat.name || cat;

                  return (
                    <div
                      key={id || index}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{name}</p>
                          {cat.slug && (
                            <p className="text-xs text-gray-400">slug: /{cat.slug}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(id, name)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Delete Category"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;