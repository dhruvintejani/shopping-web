import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export default function CartPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShipping = useCartStore((state) => state.getShipping);
  const getTax = useCartStore((state) => state.getTax);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  const handleClearCart = useCallback(() => {
    clearCart();
    setShowClearConfirm(false);
  }, [clearCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some items to get started!</p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-xl p-6 flex gap-6 shadow-sm">
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-orange-600 line-clamp-2 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Brand: {item.product.brand}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart Button - Premium Design */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="
                  inline-flex items-center gap-2 px-4 py-2.5
                  text-sm font-medium text-gray-600
                  bg-white border border-gray-200 rounded-lg
                  hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700
                  active:bg-gray-100
                  transition-all duration-150
                  shadow-sm
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 35 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <span className="font-medium">Almost there!</span> Add ${(35 - subtotal).toFixed(2)} more for FREE shipping
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-medium py-3.5 rounded-lg transition-colors mt-6 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block w-full text-center text-gray-600 hover:text-orange-600 font-medium py-3 mt-2 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

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
      />
    </div>
  );
}
