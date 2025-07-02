// Utilitaires pour gérer le défilement de manière optimisée

/**
 * Défilement fluide vers le haut de la page
 */
export const smoothScrollToTop = (): void => {
  // Utiliser requestAnimationFrame pour un défilement plus fluide
  const scrollToTop = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, currentScroll - currentScroll / 8);
    }
  };
  scrollToTop();
};

/**
 * Défilement fluide vers un élément spécifique
 */
export const smoothScrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }
};

/**
 * Défilement fluide vers une position spécifique
 */
export const smoothScrollToPosition = (y: number): void => {
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
};

/**
 * Vérifier si le défilement est en cours
 */
let isScrolling = false;
export const isCurrentlyScrolling = (): boolean => isScrolling;

/**
 * Défilement avec gestion des conflits
 */
export const safeScrollToTop = (): void => {
  if (isScrolling) return;
  
  isScrolling = true;
  
  // Utiliser un défilement plus simple pour éviter les conflits
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Réinitialiser le flag après un délai
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
};

/**
 * Désactiver temporairement le défilement automatique
 */
export const disableAutoScroll = (): void => {
  document.documentElement.style.scrollBehavior = 'auto';
};

/**
 * Réactiver le défilement automatique
 */
export const enableAutoScroll = (): void => {
  document.documentElement.style.scrollBehavior = 'smooth';
};

/**
 * Gestionnaire de navigation avec défilement optimisé
 */
export const handleNavigationWithScroll = (
  navigateFunction: () => void,
  delay: number = 100
): void => {
  // Désactiver temporairement le défilement automatique
  disableAutoScroll();
  
  // Attendre un peu avant de naviguer pour éviter les conflits
  setTimeout(() => {
    navigateFunction();
    // Réactiver le défilement après la navigation
    setTimeout(() => {
      enableAutoScroll();
    }, 200);
  }, delay);
}; 