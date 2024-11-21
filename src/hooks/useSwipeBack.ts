import { useEffect, useRef, useState, useCallback } from 'react';

interface SwipeConfig {
  onBack: () => boolean;
  threshold?: number;
  enabled?: boolean;
  confirmExit?: boolean;
  confirmMessage?: string;
}

export function useSwipeBack({ 
  onBack, 
  threshold = 100, 
  enabled = true,
  confirmExit = false,
  confirmMessage = 'Are you sure you want to exit?' 
}: SwipeConfig) {
  const touchStart = useRef<number>(0);
  const [swiping, setSwiping] = useState(false);
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout>();
  const lastSwipeTime = useRef(0);

  const handleSwipeBack = useCallback(() => {
    // Check if back action was handled
    const wasHandled = onBack();

    // If back wasn't handled and we're confirming exit
    if (!wasHandled && confirmExit) {
      const now = Date.now();
      
      // Reset counter if more than 2 seconds have passed
      if (now - lastSwipeTime.current > 2000) {
        backPressCount.current = 0;
      }
      
      backPressCount.current++;
      lastSwipeTime.current = now;

      if (backPressCount.current === 1) {
        const message = typeof confirmMessage === 'string' ? confirmMessage : 
          (document.documentElement.lang === 'ar' ? 'اسحب مرة أخرى للخروج' : 'Swipe again to exit');
        
        // You can implement your own toast/notification here
        console.log(message);

        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return;
      }
    }

    if (backPressTimer.current) {
      clearTimeout(backPressTimer.current);
    }

    backPressCount.current = 0;

    // If back wasn't handled and we're not confirming exit or this is the second swipe
    if (!wasHandled && (!confirmExit || backPressCount.current > 1)) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    }
  }, [onBack, confirmExit, confirmMessage]);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0].pageX < 50) { // Only trigger near screen edge
        touchStart.current = e.touches[0].pageX;
        setSwiping(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swiping) return;

      const diff = e.touches[0].pageX - touchStart.current;
      if (diff > threshold) {
        setSwiping(false);
        handleSwipeBack();
      }
    };

    const handleTouchEnd = () => {
      setSwiping(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current);
      }
    };
  }, [enabled, threshold, handleSwipeBack, swiping]);

  return { swiping, backPressCount: backPressCount.current };
}