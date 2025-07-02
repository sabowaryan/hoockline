import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { handleNavigationWithScroll, safeScrollToTop } from '../../utils/scrollUtils';

interface ScrollManagerProps {
  children: React.ReactNode;
}

export function ScrollManager({ children }: ScrollManagerProps) {
  const location = useLocation();

  useEffect(() => {
    // Gérer le défilement lors des changements de route
    const handleRouteChange = () => {
      // Délai pour laisser le temps au DOM de se mettre à jour
      setTimeout(() => {
        safeScrollToTop();
      }, 100);
    };

    handleRouteChange();
  }, [location.pathname]);



  return <>{children}</>;
} 