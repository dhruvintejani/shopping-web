import { useProductStore } from '../store/productStore';
import { Product, ProductFilters, ProductsResponse, SearchSuggestion } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get products from store
const getProductsFromStore = () => useProductStore.getState().products;

export const productService = {
  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    await delay(300);

    let filtered = [...getProductsFromStore()];

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === filters.brand?.toLowerCase()
      );
    }

    // Price range
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= (filters.minPrice || 0));
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= (filters.minRating || 0));
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: endIndex < filtered.length,
    };
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    const products = getProductsFromStore();
    return products.find((p: Product) => p.id === id) || null;
  },

  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    await delay(150);

    if (!query.trim()) return [];

    const products = getProductsFromStore();
    const searchLower = query.toLowerCase();
    const suggestions = products
      .filter(
        (p: Product) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
      )
      .slice(0, 8)
      .map((p: Product) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        image: p.image,
      }));

    return suggestions;
  },

  async getDeals(): Promise<Product[]> {
    await delay(200);
    const products = getProductsFromStore();
    return products.filter((p: Product) => p.badge === 'deal' || p.originalPrice).slice(0, 8);
  },

  async getBestsellers(): Promise<Product[]> {
    await delay(200);
    const products = getProductsFromStore();
    return products.filter((p: Product) => p.badge === 'bestseller').slice(0, 8);
  },

  async getRelatedProducts(productId: string): Promise<Product[]> {
    await delay(200);
    const products = getProductsFromStore();
    const product = products.find((p: Product) => p.id === productId);
    if (!product) return [];

    return products
      .filter((p: Product) => p.id !== productId && p.category === product.category)
      .slice(0, 4);
  },
};
