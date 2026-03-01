import { memo, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import Tooltip from '@mui/material/Tooltip';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useProductStore } from '../store/productStore';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Product } from '../types';
import { useReducedMotion } from '../hooks/useDebounce';
import { categories } from '../data/products';

// Category colors for chips
const categoryColors: Record<string, string> = {
  'Electronics': 'bg-blue-50 text-blue-700 border-blue-200',
  'Fashion': 'bg-purple-50 text-purple-700 border-purple-200',
  'Home & Kitchen': 'bg-teal-50 text-teal-700 border-teal-200',
  'Books': 'bg-amber-50 text-amber-700 border-amber-200',
  'Sports & Outdoors': 'bg-green-50 text-green-700 border-green-200',
  'Beauty & Personal Care': 'bg-pink-50 text-pink-700 border-pink-200',
  'Toys & Games': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Health & Wellness': 'bg-red-50 text-red-700 border-red-200',
};

// Stock filter type
type StockFilter = 'all' | 'inStock' | 'outOfStock';

// Premium Dropdown Component for forms
const PremiumFormDropdown = memo(function PremiumFormDropdown({
  label,
  value,
  options,
  onChange,
  required = false,
  placeholder = 'Select option',
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg transition-all bg-white text-left ${
            isOpen 
              ? 'border-orange-500 ring-2 ring-orange-100' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-30 overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                    value === option.value
                      ? 'bg-orange-50 text-orange-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

// Category options for dropdown
const categoryOptions = [
  { value: '', label: 'Select category' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Home & Kitchen', label: 'Home & Kitchen' },
  { value: 'Books', label: 'Books' },
  { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
  { value: 'Beauty & Personal Care', label: 'Beauty & Personal Care' },
  { value: 'Toys & Games', label: 'Toys & Games' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
];

// Badge options for dropdown
const badgeOptions = [
  { value: '', label: 'No badge' },
  { value: 'bestseller', label: 'Best Seller' },
  { value: 'deal', label: 'Deal' },
  { value: 'new', label: 'New' },
];

// Product Form Component
const ProductForm = memo(function ProductForm({
  product,
  onSave,
  onCancel,
  isLoading,
}: {
  product: Partial<Product> | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    originalPrice: 0,
    category: '',
    brand: '',
    description: '',
    image: '',
    images: [],
    stock: 0,
    rating: 0,
    reviews: 0,
    badge: undefined,
    ...product,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter product title"
          />
        </div>

        {/* Category - Premium Dropdown */}
        <PremiumFormDropdown
          label="Category"
          value={formData.category || ''}
          options={categoryOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          required
          placeholder="Select category"
        />

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter brand name"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="0.00"
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price ($)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="0.00"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="0"
          />
        </div>

        {/* Badge - Premium Dropdown */}
        <PremiumFormDropdown
          label="Badge"
          value={formData.badge || ''}
          options={badgeOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, badge: (value || undefined) as 'deal' | 'bestseller' | 'new' | 'limited' | undefined }))}
          placeholder="No badge"
        />

        {/* Image Upload / URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image <span className="text-red-500">*</span>
          </label>
          
          {/* Image Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Drag & drop an image, or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // For demo: Use a placeholder URL with file name
                      // In production: Upload to Cloudinary and get URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({
                          ...prev,
                          image: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
            
            {/* URL Input Alternative */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Or enter image URL:</p>
              <input
                type="url"
                name="image"
                value={formData.image?.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 object-contain bg-white rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
            placeholder="Enter product description"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            product?.id ? 'Update Product' : 'Add Product'
          )}
        </button>
      </div>
    </form>
  );
});

// Product Row Component
const ProductRow = memo(function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string, title: string) => void;
}) {
  const categoryColor = categoryColors[product.category] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.title}
            className="w-12 h-12 object-contain bg-gray-100 rounded-lg"
          />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.title}</p>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${categoryColor}`}>
          {product.category}
        </span>
      </td>
      <td className="px-4 py-3 text-center font-medium text-gray-900">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          product.stock > 10
            ? 'bg-green-50 text-green-700 border border-green-200'
            : product.stock > 0
            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {product.badge ? (
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
            product.badge === 'bestseller'
              ? 'bg-orange-50 text-orange-700 border-orange-200'
              : product.badge === 'deal'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="Edit product" placement="top" arrow>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Edit product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </Tooltip>
          <Tooltip title="Delete product" placement="top" arrow>
            <button
              onClick={() => onDelete(product.id, product.title)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Delete product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
});

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const addToast = useUIStore((state) => state.addToast);
  const prefersReducedMotion = useReducedMotion();
  const queryClient = useQueryClient();
  
  // Use product store for data management
  const storeProducts = useProductStore((state) => state.products);
  const addProductToStore = useProductStore((state) => state.addProduct);
  const updateProductInStore = useProductStore((state) => state.updateProduct);
  const deleteProductFromStore = useProductStore((state) => state.deleteProduct);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string; title: string }>({ show: false, id: '', title: '' });
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown]);

  // Close category dropdown on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCategoryDropdown(false);
    };
    if (showCategoryDropdown) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showCategoryDropdown]);

  // Invalidate React Query cache to sync data across all views
  const invalidateProductQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    queryClient.invalidateQueries({ queryKey: ['bestsellers'] });
  }, [queryClient]);

  // Check authorization
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Fetch products from store
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      // Use products from store (synced state)
      setProducts(storeProducts);
      setIsLoading(false);
    }
    fetchProducts();
  }, [storeProducts]);

  // Stock counts for filter buttons
  const stockCounts = useMemo(() => ({
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }), [products]);

  // Filter products by search, stock, and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Stock filter
      const matchesStock = 
        stockFilter === 'all' ||
        (stockFilter === 'inStock' && p.stock > 0) ||
        (stockFilter === 'outOfStock' && p.stock === 0);
      
      // Category filter
      const matchesCategory = 
        categoryFilter === 'all' || 
        p.category === categoryFilter;
      
      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [products, searchQuery, stockFilter, categoryFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = useCallback(async (id: string, title: string) => {
    setDeleteConfirm({ show: true, id, title });
  }, []);

  const confirmDelete = useCallback(async () => {
    // Delete from store (syncs across all views)
    deleteProductFromStore(deleteConfirm.id);
    // Invalidate React Query cache to trigger refetch in other components
    invalidateProductQueries();
    addToast({ type: 'success', message: 'Product deleted successfully' });
    setDeleteConfirm({ show: false, id: '', title: '' });
  }, [deleteConfirm.id, deleteProductFromStore, invalidateProductQueries, addToast]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSaveProduct = async (data: Partial<Product>) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (editingProduct) {
      // Update existing product in store
      updateProductInStore(editingProduct.id, data);
      addToast({ type: 'success', message: 'Product updated successfully' });
    } else {
      // Add new product to store
      const newProduct: Product = {
        ...data,
        id: `product_${Date.now()}`,
        rating: data.rating || 4.0,
        reviews: data.reviews || 0,
        images: data.images || [data.image || ''],
        tags: [data.category?.toLowerCase() || '', data.brand?.toLowerCase() || ''],
        specifications: {
          'Brand': data.brand || '',
          'Category': data.category || '',
        },
        createdAt: new Date().toISOString(),
      } as Product;
      addProductToStore(newProduct);
      addToast({ type: 'success', message: 'Product added successfully' });
    }

    // Invalidate React Query cache to sync with other views
    invalidateProductQueries();

    setIsSaving(false);
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage products, orders, and more</p>
        </div>

        {/* Stock Filter Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => { setStockFilter('all'); setCurrentPage(1); }}
            className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all cursor-pointer text-left ${
              stockFilter === 'all' 
                ? 'border-orange-500 ring-2 ring-orange-100' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stockFilter === 'all' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${stockFilter === 'all' ? 'text-orange-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className={`text-sm ${stockFilter === 'all' ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stockCounts.total}</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => { setStockFilter('inStock'); setCurrentPage(1); }}
            className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all cursor-pointer text-left ${
              stockFilter === 'inStock' 
                ? 'border-green-500 ring-2 ring-green-100' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stockFilter === 'inStock' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${stockFilter === 'inStock' ? 'text-green-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-sm ${stockFilter === 'inStock' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>In Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stockCounts.inStock}</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => { setStockFilter('outOfStock'); setCurrentPage(1); }}
            className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all cursor-pointer text-left ${
              stockFilter === 'outOfStock' 
                ? 'border-red-500 ring-2 ring-red-100' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stockFilter === 'outOfStock' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${stockFilter === 'outOfStock' ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-sm ${stockFilter === 'outOfStock' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stockCounts.outOfStock}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Products</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Category Filter Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-20 overflow-hidden"
                      >
                        <div className="py-1 max-h-[300px] overflow-y-auto">
                          <button
                            onClick={() => { setCategoryFilter('all'); setShowCategoryDropdown(false); setCurrentPage(1); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                              categoryFilter === 'all' ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span>All Categories</span>
                            {categoryFilter === 'all' && (
                              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => { setCategoryFilter(cat.name); setShowCategoryDropdown(false); setCurrentPage(1); }}
                              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                                categoryFilter === cat.name ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{cat.name}</span>
                              {categoryFilter === cat.name && (
                                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search products..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {/* Add Button */}
                <button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Badge</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-xl shadow-2xl z-50 overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <ProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  isLoading={isSaving}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Product Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: '', title: '' })}
        onConfirm={confirmDelete}
        title="Delete this product?"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />
    </div>
  );
}
