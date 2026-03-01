import { memo, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { LocationModal } from '../ui/LocationModal';
import { ScrollToTop } from '../../hooks/useScrollToTop';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[108px] md:h-[120px]" />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      {/* Overlays */}
      <CartDrawer />
      <ToastContainer />
      <LocationModal />
      <ScrollToTop />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';
