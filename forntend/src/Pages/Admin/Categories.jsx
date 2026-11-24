import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../redux/services/productApi';
import { FiPlus, FiTrash2, FiGrid, FiEdit2, FiImage, FiX } from 'react-icons/fi';

const Categories = () => {
  const { data: categoryData, isLoading, isError, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Create Form State
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Edit Modal State
  const [editingCat, setEditingCat] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const rawCategories = categoryData?.data?.categories || categoryData?.data || categoryData;
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : [];

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Create Category Handler (FormData for Cloudinary)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const formData = new FormData();
    formData.append('name', categoryName.trim());
    if (description.trim()) formData.append('description', description.trim());
    if (imageFile) formData.append('image', imageFile);

    try {
      await createCategory(formData).unwrap();
      setCategoryName('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      alert('Category created successfully!');
    } catch (err) {
      alert(err?.data?.message || 'Failed to create category.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setEditName(cat.name || '');
    setEditDescription(cat.description || '');
    setEditImageFile(null);
    const currentImg = typeof cat.image === 'string' ? cat.image : cat.image?.url || '';
    setEditImagePreview(currentImg);
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  // Update Category Handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCat || !editName.trim()) return;

    const formData = new FormData();
    formData.append('name', editName.trim());
    formData.append('description', editDescription.trim());
    if (editImageFile) formData.append('image', editImageFile);

    try {
      await updateCategory({ categoryId: editingCat._id, formData }).unwrap();
      setEditingCat(null);
      alert('Category updated successfully!');
    } catch (err) {
      alert(err?.data?.message || 'Failed to update category.');
    }
  };

  // Delete Category Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory(id).unwrap();
        alert('Category deleted successfully!');
      } catch (err) {
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
          Create, edit images, and manage product categories for your storefront.
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
              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Category Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden transition-all">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3">
                      <FiImage className="text-xl text-gray-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-gray-600 block">Upload Cover Image</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WEBP</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
              </div>

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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short tagline (optional)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !categoryName.trim()}
                className="w-full bg-black text-white font-bold text-xs py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading & Creating...</span>
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
                  const imgUrl = (typeof cat.image === 'string' ? cat.image : cat.image?.url)?.replace('http://', 'https://');

                  return (
                    <div
                      key={id || index}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 uppercase shrink-0">
                            {name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-gray-900">{name}</p>
                          {cat.slug && (
                            <p className="text-xs text-gray-400">slug: /{cat.slug}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="px-3 py-1.5 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Edit Category & Image"
                        >
                          <FiEdit2 /> Edit / Image
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(id, name)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                          title="Delete Category"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Category & Image Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black uppercase text-gray-900">
                Edit Category: {editingCat.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                Category Image (Click to change)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                {editImagePreview ? (
                  <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <FiImage className="text-2xl text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-600">Select Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleEditImageSelect} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="flex-1 border border-gray-200 text-gray-700 text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-black text-white text-xs font-bold uppercase py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  ); 
};

export default Categories;