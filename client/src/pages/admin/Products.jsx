import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit2, Trash2, X, AlertCircle, Upload, Eye } from 'lucide-react';
import * as productService from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';
import { productFormSchema } from '../../validations/schemas.js';
import { formatPrice } from '../../utils/formatters.js';
import Loader from '../../components/common/Loader.jsx';

const Products = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [apiError, setApiError] = useState('');

  // Fetch products
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => productService.getProducts({ pageSize: 50 }) // Fetch larger page size for admin management
  });

  // Fetch categories for dropdown
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const products = productData?.products || [];
  const categories = categoryData?.categories || [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(productFormSchema)
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      closeModal();
    },
    onError: (err) => {
      setApiError(err.response?.data?.message || 'Failed to create product.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => productService.updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      closeModal();
    },
    onError: (err) => {
      setApiError(err.response?.data?.message || 'Failed to update product.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  });

  const openModal = (product = null) => {
    setApiError('');
    setSelectedFiles([]);
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price.toString());
      setValue('category', product.category?._id || '');
      setValue('stock', product.stock.toString());
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFiles([]);
    setApiError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = (data) => {
    setApiError('');

    // Construct Multipart Form Data
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('stock', data.stock);

    // Append files
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, formData });
    } else {
      // Images are required when creating a new product
      if (selectedFiles.length === 0) {
        setApiError('At least one product image is required.');
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Manage catalog products and upload images.</p>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-full shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {productsLoading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl">
          <p className="text-slate-400">No products found. Add products to populate your store catalog.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.map((prod) => {
                  const firstImage = prod.images?.[0]?.url || 'https://via.placeholder.com/50';
                  return (
                    <tr key={prod._id} className="text-slate-600 hover:bg-slate-50/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={firstImage}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 line-clamp-1">{prod.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">Slug: {prod.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {prod.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{formatPrice(prod.price)}</td>
                      <td className="px-6 py-4">
                        {prod.stock === 0 ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            Out of Stock
                          </span>
                        ) : prod.stock <= 5 ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            Low Stock ({prod.stock})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            In Stock ({prod.stock})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openModal(prod)}
                          className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors inline-flex"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-2 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 rounded-lg transition-colors inline-flex"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {apiError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Denim Jacket"
                  {...register('name')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                    errors.name ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Category</label>
                <select
                  {...register('category')}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                    errors.category ? 'border-rose-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-500 font-semibold">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    {...register('price')}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                      errors.price ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.price && <p className="text-xs text-rose-500 font-semibold">{errors.price.message}</p>}
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="50"
                    {...register('stock')}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all ${
                      errors.stock ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.stock && <p className="text-xs text-rose-500 font-semibold">{errors.stock.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Description</label>
                <textarea
                  placeholder="Describe your product detail guidelines..."
                  {...register('description')}
                  rows="4"
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-all resize-none ${
                    errors.description ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {errors.description && <p className="text-xs text-rose-500 font-semibold">{errors.description.message}</p>}
              </div>

              {/* Images File Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Product Images {editingProduct && '(Optional: upload to replace current)'}
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Click or drag images to upload</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP up to 5MB each</p>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Selected Files ({selectedFiles.length})</p>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {selectedFiles.map((file, i) => (
                        <li key={i} className="truncate">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-full transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-full shadow-lg shadow-indigo-100 transition-colors text-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
