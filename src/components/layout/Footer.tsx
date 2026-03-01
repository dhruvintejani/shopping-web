import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export const Footer = memo(function Footer() {
  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  return (
    <footer className="mt-auto">
      {/* Back to Top */}
      {/* <button
        onClick={scrollToTop}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-4 transition-colors"
      >
        Back to top
      </button> */}

      {/* Main Footer */}
      <div className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Get to Know Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white hover:underline">About Shoply</Link></li>
              <li><Link to="/careers" className="hover:text-white hover:underline">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
              <li><Link to="/press" className="hover:text-white hover:underline">Press Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Shop With Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/products" className="hover:text-white hover:underline">All Products</Link></li>
              <li><Link to="/products?badge=deal" className="hover:text-white hover:underline">Today's Deals</Link></li>
              <li><Link to="/products?badge=bestseller" className="hover:text-white hover:underline">Best Sellers</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-white hover:underline">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Your Account</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/profile" className="hover:text-white hover:underline">Your Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white hover:underline">Your Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white hover:underline">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white hover:underline">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Help & Support</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/help" className="hover:text-white hover:underline">Help Center / FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white hover:underline">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white hover:underline">Returns & Refunds</Link></li>
              <li><Link to="/track-order" className="hover:text-white hover:underline">Track Your Order</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <Logo className="w-24 h-8" variant="light" />
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-white hover:underline">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-white hover:underline">Cookie Policy</Link>
              <Link to="/accessibility" className="hover:text-white hover:underline">Accessibility</Link>
            </div>
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Shoply. All rights reserved. This is a demo e-commerce website.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
