import { create } from 'zustand';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';

interface ProductState {
  products: Product[];
  lastUpdated: number;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  invalidateCache: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,
  lastUpdated: Date.now(),

  addProduct: (product) => {
    set((state) => ({
      products: [product, ...state.products],
      lastUpdated: Date.now(),
    }));
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } as Product : p
      ),
      lastUpdated: Date.now(),
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      lastUpdated: Date.now(),
    }));
  },

  getProducts: () => get().products,

  getProductById: (id) => get().products.find((p) => p.id === id),

  invalidateCache: () => {
    set({ lastUpdated: Date.now() });
  },
}));

// Selector for optimized re-renders
export const useProducts = () => useProductStore((state) => state.products);
export const useLastUpdated = () => useProductStore((state) => state.lastUpdated);
