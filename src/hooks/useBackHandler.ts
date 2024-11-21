import { useEffect, useCallback, useRef } from 'react';

interface BackHandlerProps {
  onBack: () => boolean;
  enabled?: boolean;
  preventDefaultBehavior?: boolean;
  confirmExit?: boolean;
  confirmMessage?: string;
}

export function useBackHandler({ 
  onBack, 
  enabled = true, 
  preventDefaultBehavior = true,
  confirmExit = false,
  confirmMessage = 'Are you sure you want to exit?'
}: BackHandlerProps) {
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout>();
  const lastBackPress = useRef(0);

  const handleBack = useCallback((event?: PopStateEvent | Event) => {
    if (event && preventDefaultBehavior) {
      event.preventDefault();
    }

    // Check if back action was handled
    const wasHandled = onBack();

    // If back wasn't handled and we're confirming exit
    if (!wasHandled && confirmExit) {
      const now = Date.now();
      
      // Reset counter if more than 2 seconds have passed
      if (now - lastBackPress.current > 2000) {
        backPressCount.current = 0;
      }
      
      backPressCount.current++;
      lastBackPress.current = now;

      if (backPressCount.current === 1) {
        const message = typeof confirmMessage === 'string' ? confirmMessage : 
          (document.documentElement.lang === 'ar' ? 'اضغط مرة أخرى للخروج' : 'Press again to exit');
        
        // You can implement your own toast/notification here
        console.log(message);

        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return;
      }
    }

    // Clear any existing timer
    if (backPressTimer.current) {
      clearTimeout(backPressTimer.current);
    }

    // Reset counter
    backPressCount.current = 0;

    // If back wasn't handled and we're not confirming exit or this is the second press
    if (!wasHandled && (!confirmExit || backPressCount.current > 1)) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    }
  }, [onBack, preventDefaultBehavior, confirmExit, confirmMessage]);

  useEffect(() => {
    if (!enabled) return;

    // Handle browser back button
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBack);

    // Handle hardware back button (Android)
    document.addEventListener('backbutton', handleBack);

    return () => {
      window.removeEventListener('popstate', handleBack);
      document.removeEventListener('backbutton', handleBack);
      if (backPressTimer.current) {
        clearTimeout(backPressTimer.current);
      }
    };
  }, [enabled, handleBack]);

  return { backPressCount: backPressCount.current };
}