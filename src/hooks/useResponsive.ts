import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isShortScreen: boolean;
  isTallScreen: boolean;
  hasTouch: boolean;
  hasMouse: boolean;
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
  dimensions: Dimensions;
  safeArea: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export function useResponsive(): ResponsiveConfig {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [hasTouch, setHasTouch] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      // Update safe area insets
      const computedStyle = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0')
      });
    };

    // Initial check for input devices
    setHasTouch('ontouchstart' in window);
    setHasMouse(window.matchMedia('(pointer: fine)').matches);

    // Check motion preferences
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Check color scheme preference
    setPrefersDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Set CSS variables for safe area insets
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');

    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Listen for changes in preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    reducedMotionQuery.addEventListener('change', (e) => setPrefersReducedMotion(e.matches));
    darkModeQuery.addEventListener('change', (e) => setPrefersDarkMode(e.matches));

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      reducedMotionQuery.removeEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      darkModeQuery.removeEventListener('change', (e) => setPrefersDarkMode(e.matches));
    };
  }, []);

  return {
    isMobile: dimensions.width < 640,
    isTablet: dimensions.width >= 640 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024,
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,
    isShortScreen: dimensions.height < 600,
    isTallScreen: dimensions.height > 800,
    hasTouch,
    hasMouse,
    prefersReducedMotion,
    prefersDarkMode,
    dimensions,
    safeArea
  };
}