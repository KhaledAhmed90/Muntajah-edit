import { useState, useCallback, useEffect } from 'react';

export interface NavigationState {
  view: string;
  params?: Record<string, any>;
}

export function useNavigationStack(initialView: string = 'home') {
  const [stack, setStack] = useState<NavigationState[]>([{ view: initialView }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback((view: string, params?: Record<string, any>) => {
    setStack(prevStack => {
      // Remove any forward history when navigating to a new view
      const newStack = prevStack.slice(0, currentIndex + 1);
      return [...newStack, { view, params }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const goBack = useCallback((): boolean => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentIndex]);

  const getCurrentView = useCallback((): NavigationState => {
    return stack[currentIndex];
  }, [stack, currentIndex]);

  const canGoBack = currentIndex > 0;

  return {
    navigate,
    goBack,
    getCurrentView,
    canGoBack
  };
}