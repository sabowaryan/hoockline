import { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

// Cache global pour les profils utilisateurs
const globalProfileCache = new Map<string, { profile: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// État global pour éviter les rechargements multiples
let globalAuthState = {
  user: null as any,
  userProfile: null as any,
  isInitialized: false,
  lastUpdate: 0
};

export function useAuthPersistence() {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getCachedProfile = (userId: string) => {
    const cached = globalProfileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.profile;
    }
    return null;
  };

  const setCachedProfile = (userId: string, profile: any) => {
    globalProfileCache.set(userId, { profile, timestamp: Date.now() });
  };

  const clearCache = () => {
    globalProfileCache.clear();
    globalAuthState = {
      user: null,
      userProfile: null,
      isInitialized: false,
      lastUpdate: 0
    };
  };

  const updateGlobalState = (user: any, userProfile: any) => {
    globalAuthState = {
      user,
      userProfile,
      isInitialized: true,
      lastUpdate: Date.now()
    };
  };

  return {
    getCachedProfile,
    setCachedProfile,
    clearCache,
    updateGlobalState,
    globalAuthState,
    mountedRef
  };
}

// Hook pour optimiser les requêtes de profil
export function useProfileOptimizer() {
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef<{ userId: string; timestamp: number } | null>(null);

  const shouldFetchProfile = (userId: string) => {
    // Éviter les requêtes multiples simultanées
    if (isFetchingRef.current) {
      return false;
    }

    // Éviter les requêtes trop fréquentes (délai de 2 secondes)
    if (lastFetchRef.current && 
        lastFetchRef.current.userId === userId && 
        Date.now() - lastFetchRef.current.timestamp < 2000) {
      return false;
    }

    return true;
  };

  const startFetch = (userId: string) => {
    isFetchingRef.current = true;
    lastFetchRef.current = { userId, timestamp: Date.now() };
  };

  const endFetch = () => {
    isFetchingRef.current = false;
  };

  return {
    shouldFetchProfile,
    startFetch,
    endFetch
  };
} 