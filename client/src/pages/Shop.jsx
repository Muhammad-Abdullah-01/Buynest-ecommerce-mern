import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import { getProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Read current filters from URL
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') || '';
  const pageNumber = Number(searchParams.get('pageNumber')) || 1;

  // Local state for price range inputs (to avoid hitting API on every keystroke)
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Fetch products based on search params
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['shopProducts', keyword, category, sortBy, minPrice, maxPrice, inStock, pageNumber],
    queryFn: () =>
      getProducts({
        keyword,
        category,
        sortBy,
        minPrice,
        maxPrice,
        inStock,
        pageNumber,
        pageSize: 9
      })
  });

  // Fetch categories for sidebar filter
  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const products = productData?.products || [];
  const categories = categoryData?.categories || [];
  const totalPages = productData?.pages || 1;

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    // Always reset to page 1 on filter changes
    params.set('pageNumber', '1');

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateFilters({ minPrice: localMinPrice, maxPrice: localMaxPrice });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setLocalMinPrice('');
    setLocalMaxPrice('');
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNumber', newPage.toString());
    setSearchParams(params);
  };

  const filterSidebar = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Categories</h3>
        <div className="flex flex-col space-y-1.5">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`text-left text-sm py-1 font-medium transition-colors ${
              category === '' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`text-left text-sm py-1 font-medium transition-colors ${
                category === cat.slug ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Price Range Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Price Range</h3>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-1.8 rounded-lg transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      <hr className="border-slate-200" />

      {/* Availability Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Availability</h3>
        <label className="flex items-center space-x-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock === 'true'}
            onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : '' })}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      <hr className="border-slate-200" />

      {/* Clear Filters */}
      <button
        onClick={handleClearAll}
        className="flex items-center justify-center space-x-1.5 w-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold py-2 rounded-xl transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Products</h1>
          {keyword && (
            <p className="text-sm text-slate-500 mt-1">
              Search results for "<span className="font-semibold text-indigo-600">{keyword}</span>"
            </p>
          )}
        </div>

        {/* Sorting Dropdown & Filter toggle */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsFilterMobileOpen(true)}
            className="md:hidden flex items-center space-x-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-1.8 text-sm focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratings">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex-shrink-0 sticky top-24">
          {filterSidebar}
        </aside>

        {/* Products Grid */}
        <div className="flex-grow space-y-8">
          {productsLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 text-lg">No Products Found</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
                Try loosening your filters or search keywords to find what you want.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2 rounded-full shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 pt-6 border-t border-slate-100">
                  <button
                    disabled={pageNumber === 1}
                    onClick={() => handlePageChange(pageNumber - 1)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-xl transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          pageNumber === page
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    disabled={pageNumber === totalPages}
                    onClick={() => handlePageChange(pageNumber + 1)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 rounded-xl transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sidebar - Mobile Drawer */}
      {isFilterMobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsFilterMobileOpen(false)}
          />
          <div className="relative w-80 max-w-md bg-white h-full p-6 shadow-xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                <button
                  onClick={() => setIsFilterMobileOpen(false)}
                  className="text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebar}
            </div>
            <button
              onClick={() => setIsFilterMobileOpen(false)}
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full shadow-lg"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
