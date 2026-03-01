import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { ToastContainer } from './components/ui/Toast';
import { PageTransition } from './components/animations/PageTransition';
import { LocationModal } from './components/ui/LocationModal';
import { ScrollToTop } from './hooks/useScrollToTop';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AuthPages = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Static pages
const AboutPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.ContactPage })));
const CareersPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.CareersPage })));
const TermsPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.PrivacyPage })));
const ShippingPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.ShippingPage })));
const ReturnsPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.ReturnsPage })));
const HelpPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.HelpPage })));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoader />} key={location.pathname}>
        <Outlet />
      </Suspense>
    </AnimatePresence>
  );
}

// Main layout with header and footer - with header spacer and controlled scrolling
function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <ScrollToTop />
      <Header />
      {/* Main scrollable container - uses internal scrolling */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Spacer for fixed header - responsive height */}
        <div className="h-[96px] md:h-[108px] lg:h-[120px] flex-shrink-0" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden main-scroll-container" id="main-scroll-container">
          <AnimatedRoutes />
          <Footer />
        </main>
      </div>
      <CartDrawer />
      <LocationModal />
      <ToastContainer />
    </div>
  );
}

// Auth layout without header/footer
function AuthLayout() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <ToastContainer />
    </>
  );
}

// Wrapper component for pages that need PageTransition
function PageWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes (no header/footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AuthPages />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main routes with header/footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><ProductsPage /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
            <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
            <Route path="/orders" element={<PageWrapper><OrdersPage /></PageWrapper>} />
            <Route path="/orders/:id" element={<PageWrapper><OrdersPage /></PageWrapper>} />
            <Route path="/wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
            
            {/* Static pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Redirect common paths */}
            <Route path="/cookies" element={<PrivacyPage />} />
            <Route path="/accessibility" element={<HelpPage />} />
            <Route path="/press" element={<AboutPage />} />
            <Route path="/track-order" element={<PageWrapper><OrdersPage /></PageWrapper>} />
            
            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-xl text-gray-500 mb-6">Page not found</p>
                      <a href="/" className="text-orange-600 hover:underline font-medium">
                        Go back home
                      </a>
                    </div>
                  </div>
                </PageTransition>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
