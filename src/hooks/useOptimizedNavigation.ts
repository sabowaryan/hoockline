import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleNavigationWithScroll } from '../utils/scrollUtils';

/**
 * Hook personnalisé pour la navigation optimisée avec gestion du défilement
 */
export function useOptimizedNavigation() {
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string, delay: number = 50) => {
    handleNavigationWithScroll(() => {
      navigate(path);
    }, delay);
  }, [navigate]);

  const navigateToGenerator = useCallback(() => {
    navigateTo('/generator');
  }, [navigateTo]);

  const navigateToPayment = useCallback(() => {
    navigateTo('/payment');
  }, [navigateTo]);

  const navigateToResults = useCallback(() => {
    navigateTo('/results');
  }, [navigateTo]);

  const navigateToHome = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

  const navigateToSuccess = useCallback(() => {
    navigateTo('/success');
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToGenerator,
    navigateToPayment,
    navigateToResults,
    navigateToHome,
    navigateToSuccess
  };
} 