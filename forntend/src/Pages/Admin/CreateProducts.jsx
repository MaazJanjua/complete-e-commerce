// src/Pages/Admin/CreateProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCreateProductMutation, 
  useGetCategoriesQuery 
} from '../../redux/services/productApi';
import { FiUploadCloud, FiTrash2, FiArrowLeft, FiCheck, FiPackage } from 'react-icons/fi';

const CreateProduct = () => {
  const navigate = useNavigate();

  // RTK Query Hooks
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [createProduct, { isLoading: isSubmitting, isError, error }] = useCreateProductMutation();

  const rawCategories = categoryData?.data?.categories || categoryData?.data || categoryData;
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : [];
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Form State
  const [formData, setFormData] = useState({
    title: '', // Backend expects 'title'
    description: '',
    price: '',
    stock: '',
    category: '',
    sizes: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((s) => s !== size)
          : [...prev.sizes, size],
      };
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      alert('Maximum 5 images allowed!');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submission Logic using FormData matching Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill out all required fields: Title, Price, Category.');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Please select at least one product image file!');
      return;
    }

    // Build Multipart FormData
    const formPayload = new FormData();
    formPayload.append('title', formData.title.trim());
    formPayload.append('description', formData.description.trim());
    formPayload.append('price', String(formData.price));
    formPayload.append('stock', String(formData.stock || 0));
    formPayload.append('category', formData.category);
    
    // Append sizes if selected
    formData.sizes.forEach((size) => formPayload.append('sizes', size));

    // Field Name MUST match upload.array("productImages", 5) in Backend Route
    selectedFiles.forEach((file) => {
      formPayload.append('productImages', file);
    });

    try {
      await createProduct(formPayload).unwrap();
      alert('Product Created & Uploaded to Cloudinary Successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black mb-2 transition-colors"
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
            Create New Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload images and publish products directly to Cloudinary.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-black text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <FiPackage className="text-base" />
              <span>Publish Product</span>
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
          Error: {error?.data?.message || error?.message || 'Failed to upload product'}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider">
              General Information
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Oversized Heavyweight Cotton Tee"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                placeholder="Detailed information about fit, fabric specifications..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Price (PKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    PKR
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="2999"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider">
              Product Images (Max 5) <span className="text-red-500">*</span>
            </h2>

            <div className="relative border-2 border-dashed border-gray-300 hover:border-black transition-colors rounded-xl p-8 text-center bg-gray-50 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-800">
                Click to browse or drag & drop product images
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max 5 images allowed (Field name: productImages)
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Selected Images ({imagePreviews.length}/5)
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="group relative aspect-3/4 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={src}
                        alt={`Selected Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider">
              Category <span className="text-red-500">*</span>
            </h2>

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-black focus:bg-white focus:outline-hidden focus:border-black transition-all"
            >
              <option value="">Select Category</option>
              {isCategoriesLoading ? (
                <option disabled>Loading categories...</option>
              ) : (
                categoriesList.map((cat) => (
                  <option key={cat._id || cat} value={cat._id || cat.name || cat}>
                    {cat.name || cat}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b pb-3 uppercase tracking-wider">
              Available Sizes
            </h2>

            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <FiCheck className="text-sm" />}
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;