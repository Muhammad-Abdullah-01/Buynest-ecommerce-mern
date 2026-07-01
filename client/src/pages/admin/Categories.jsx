import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import * as categoryService from '../../services/categoryService.js';
import Loader from '../../components/common/Loader.jsx';

const Categories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null means adding new

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: categoryService.getCategories
  });

  const categories = data?.categories || [];

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      closeModal();
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create category.');
    }
  });

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, categoryData }) => categoryService.updateCategory(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      closeModal();
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to update category.');
    }
  });

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  });

  const openModal = (category = null) => {
    setErrorMsg('');
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory._id,
        categoryData: { name, description }
      });
    } else {
      createMutation.mutate({ name, description });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Add, edit, or remove product categories.</p>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-full shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl">
          <p className="text-slate-400">No categories found. Create one to begin cataloging products.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {categories.map((cat) => (
                  <tr key={cat._id} className="text-slate-600 hover:bg-slate-50/40">
                    <td className="px-6 py-4 font-bold text-slate-800">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(cat)}
                        className="p-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors inline-flex"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 rounded-lg transition-colors inline-flex"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Backdrop and Box */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Menswear"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Description</label>
                <textarea
                  placeholder="Provide a description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
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
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
