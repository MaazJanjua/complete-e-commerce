import React, { useState } from 'react';
import { useUpdateProductMutation, useGetCategoriesQuery } from '../../redux/services/productApi';
import { FiX, FiCheck } from 'react-icons/fi';

const EditProductModal = ({ product, onClose }) => {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: categoryData } = useGetCategoriesQuery();

  const rawCategories = categoryData?.data?.categories || categoryData?.data || categoryData;
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : [];

  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '', // Added Description
    price: product.price || '',
    stock: product.stock !== undefined ? product.stock : 0,
    category: product.category?._id || product.category || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId: product._id,
        updatedData: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          stock: Number(formData.stock),
          category: formData.category,
        },
      }).unwrap();

      alert('Product updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update product:', err);
      alert(err?.data?.message || err?.data || 'Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-900">
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-hidden focus:border-black resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Price (PKR)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-black focus:outline-hidden focus:border-black"
            >
              <option value="">Select Category</option>
              {categoriesList.map((cat) => (
                <option key={cat._id || cat} value={cat._id || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 flex items-center justify-center gap-1"
            >
              <FiCheck /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;