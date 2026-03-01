import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

/**
 * Get the main scroll container element
 * Falls back to window if container not found
 */
function getScrollContainer(): HTMLElement | Window {
  const container = document.getElementById('main-scroll-container');
  return container || window;
}

/**
 * Scroll to top of the main container
 */
function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  const container = getScrollContainer();
  if (container instanceof Window) {
    container.scrollTo({ top: 0, behavior });
  } else {
    container.scrollTo({ top: 0, behavior });
  }
}

/**
 * Hook that scrolls to top on route change or search params change
 * Uses smooth scrolling for better UX
 * Works with internal scroll container
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const prevParamsRef = useRef<string>('');
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // Scroll to top on pathname change
    if (prevPathnameRef.current !== pathname) {
      scrollToTop('smooth');
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // Scroll to top on search params change (filters)
    const currentParams = searchParams.toString();
    if (prevParamsRef.current !== currentParams) {
      // Only scroll if params actually changed (not on initial mount)
      if (prevParamsRef.current !== '') {
        scrollToTop('smooth');
      }
      prevParamsRef.current = currentParams;
    }
  }, [searchParams]);
}

/**
 * Hook to manually scroll to top
 */
export function useScrollToTopManual() {
  return useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollToTop(behavior);
  }, []);
}

/**
 * Component that triggers scroll to top behavior
 * Place this in your App component
 */
export function ScrollToTop() {
  useScrollToTop();
  return null;
}
