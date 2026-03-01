import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useReducedMotion } from '../../hooks/useDebounce';
import { ConfirmModal } from '../ui/ConfirmModal';

export const CartDrawer = memo(function CartDrawer() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const isOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);
  const prefersReducedMotion = useReducedMotion();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  const handleClearCart = useCallback(() => {
    clearCart();
    setShowClearConfirm(false);
  }, [clearCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[9999] shadow-2xl flex flex-col"          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Shopping Cart ({itemCount})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mb-6">Add some items to get started!</p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={closeCart}
                        className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-contain"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 bg-white min-w-[40px] text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-sm text-red-600 hover:text-red-700 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                {subtotal < 35 && (
                  <p className="text-sm text-orange-600 mb-3">
                    Add ${(35 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-medium py-3 rounded-lg transition-colors mb-2"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-gray-800 text-center font-medium py-2.5 rounded-lg transition-colors"
                >
                  View Cart
                </Link>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center justify-center gap-2 w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-2 mt-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>

          {/* Clear Cart Confirmation Modal */}
          <ConfirmModal
            isOpen={showClearConfirm}
            onClose={() => setShowClearConfirm(false)}
            onConfirm={handleClearCart}
            title="Clear your cart?"
            message="Are you sure you want to remove all items from your cart? This action cannot be undone."
            confirmText="Clear Cart"
            cancelText="Keep Items"
            variant="danger"
            icon="trash"
          />
        </>
      )}
    </AnimatePresence>
  );
});
