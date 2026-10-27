// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   useGetProductsQuery, 
//   useDeleteProductMutation 
// } from '../../redux/services/productApi';
// import { FiPlus, FiTrash2, FiEdit2, FiExternalLink, FiPackage } from 'react-icons/fi';

// const ManageProducts = () => {
//   // 1. Fetch all products
//   const { data, isLoading, isError, error } = useGetProductsQuery();
//   const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

//   // Normalize data array
//   const rawProducts = data?.data?.products || data?.data || data;
//   const productsList = Array.isArray(rawProducts) ? rawProducts : [];

//   // 2. Delete Handler
//   const handleDelete = async (productId, title) => {
//     if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
//       try {
//         await deleteProduct(productId).unwrap();
//         alert('Product deleted successfully!');
//       } catch (err) {
//         console.error('Failed to delete product:', err);
//         alert(err?.data?.message || 'Failed to delete product.');
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-6xl mx-auto p-6 text-center">
//         <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//         <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
//           Loading Inventory...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
//       {/* Top Header & Actions */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
//             Manage Products
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             View, edit, and delete products from your store inventory.
//           </p>
//         </div>

//         <Link
//           to="/admin/products/create"
//           className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xs"
//         >
//           <FiPlus className="text-base" />
//           <span>Add New Product</span>
//         </Link>
//       </div>

//       {/* Error Alert */}
//       {isError && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
//           Error: {error?.data?.message || 'Failed to fetch products'}
//         </div>
//       )}

//       {/* Products Table Card */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
//         {productsList.length === 0 ? (
//           <div className="p-12 text-center space-y-3">
//             <FiPackage className="mx-auto text-4xl text-gray-300" />
//             <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
//               No Products Found
//             </h3>
//             <p className="text-xs text-gray-500">
//               Start by adding your first product to the store inventory.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
//                   <th className="py-3.5 px-4">Product</th>
//                   <th className="py-3.5 px-4">Category</th>
//                   <th className="py-3.5 px-4">Price</th>
//                   <th className="py-3.5 px-4">Stock</th>
//                   <th className="py-3.5 px-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 text-sm">
//                 {productsList.map((product) => {
//                   const firstImage = product?.productImages?.[0]?.url || product?.images?.[0] || 'https://via.placeholder.com/150';
//                   const categoryName = product?.category?.name || 'Uncategorized';

//                   return (
//                     <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
//                       {/* Product Thumbnail & Title */}
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
//                             <img
//                               src={firstImage}
//                               alt={product.title}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div>
//                             <p className="font-bold text-gray-900 line-clamp-1">
//                               {product.title}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-0.5">
//                               ID: {product._id?.slice(-6)}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Category */}
//                       <td className="py-3 px-4 text-xs font-semibold text-gray-600">
//                         <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">
//                           {categoryName}
//                         </span>
//                       </td>

//                       {/* Price */}
//                       <td className="py-3 px-4 font-bold text-gray-900 text-xs">
//                         PKR {product.price?.toLocaleString()}
//                       </td>

//                       {/* Stock Status */}
//                       <td className="py-3 px-4">
//                         {product.stock > 0 ? (
//                           <span className="inline-flex items-center text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
//                             In Stock ({product.stock})
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
//                             Out of Stock
//                           </span>
//                         )}
//                       </td>

//                       {/* Action Controls */}
//                       <td className="py-3 px-4 text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={() => handleDelete(product._id, product.title)}
//                             disabled={isDeleting}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
//                             title="Delete Product"
//                           >
//                             <FiTrash2 className="text-base" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageProducts;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetProductsQuery, 
  useDeleteProductMutation 
} from '../../redux/services/productApi';
import { FiPlus, FiTrash2, FiEdit2, FiPackage } from 'react-icons/fi';
import EditProductModal from './EditProductModal';

const ManageProducts = () => {
  const { data, isLoading, isError, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [editingProduct, setEditingProduct] = useState(null);

  const rawProducts = data?.data?.products || data?.data || data;
  const productsList = Array.isArray(rawProducts) ? rawProducts : [];

  const handleDelete = async (productId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProduct(productId).unwrap();
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert(err?.data?.message || 'Failed to delete product.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Loading Inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
            Manage Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View, edit, and delete products from your store inventory.
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <FiPlus className="text-base" />
          <span>Add New Product</span>
        </Link>
      </div>

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
          Error: {error?.data?.message || 'Failed to fetch products'}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {productsList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FiPackage className="mx-auto text-4xl text-gray-300" />
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
              No Products Found
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {productsList.map((product) => {
                  const firstImage = product?.productImages?.[0]?.url || product?.images?.[0] || 'https://via.placeholder.com/150';
                  const categoryName = product?.category?.name || 'Uncategorized';

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={firstImage}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ID: {product._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-semibold text-gray-600">
                        <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">
                          {categoryName}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-gray-900 text-xs">
                        PKR {product.price?.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                            In Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit & Delete Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            title="Edit Product"
                          >
                            <FiEdit2 className="text-base" />
                          </button>

                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            disabled={isDeleting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Delete Product"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal Popup */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ManageProducts;