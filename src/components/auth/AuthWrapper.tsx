import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { SignupPage } from '../../pages/Auth/SignupPage';
import { UnauthorizedAccess } from '../../pages/Auth/UnauthorizedAccess';

interface AuthWrapperProps {
  children: (user: User) => React.ReactNode;
}

type AuthMode = 'login' | 'signup';

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache pour éviter les rechargements inutiles
const profileCache = new Map<string, { profile: UserProfile; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthWrapper');
  }
  return context;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // Use refs to prevent infinite loops and track state
  const initialized = useRef(false);
  const lastUserId = useRef<string | null>(null);
  const isFetchingProfile = useRef(false);

  const fetchUserProfile = async (userId: string) => {
    // Éviter les requêtes multiples simultanées
    if (isFetchingProfile.current) {
      return;
    }

    // Vérifier le cache avec une durée plus longue
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached profile for user:', userId);
      setUserProfile(cached.profile);
      return;
    }

    // Éviter les requêtes trop fréquentes
    const now = Date.now();
    if (lastUserId.current === userId && now - (cached?.timestamp || 0) < 5000) {
      console.log('Profile fetch too recent, using cached data');
      return;
    }

    isFetchingProfile.current = true;
    
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile...');
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              role: 'user'
            })
            .select('id, role, created_at, updated_at')
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setUserProfile(null);
          } else {
            console.log('Created new profile:', newProfile);
            setUserProfile(newProfile);
            // Mettre en cache le nouveau profil
            profileCache.set(userId, { profile: newProfile, timestamp: Date.now() });
          }
        } else {
          setUserProfile(null);
        }
      } else {
        console.log('Profile found:', data);
        setUserProfile(data);
        // Mettre en cache le profil
        profileCache.set(userId, { profile: data, timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      setUserProfile(null);
    } finally {
      isFetchingProfile.current = false;
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) {
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            initialized.current = true;
          }
          return;
        }

        console.log('Session:', session?.user?.id || 'No session');

        if (mounted) {
          setUser(session?.user ?? null);
          lastUserId.current = session?.user?.id ?? null;
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
          initialized.current = true;
        }
      } catch (error) {
        console.error('Unexpected error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          initialized.current = true;
        }
      }
    };

    initializeAuth();

    // Listen for auth changes - optimisé pour éviter les rechargements inutiles
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted || !initialized.current) {
        return;
      }

      const newUserId = session?.user?.id ?? null;
      
      // Éviter les rechargements si l'utilisateur n'a pas changé
      if (newUserId === lastUserId.current && event !== 'SIGNED_OUT') {
        console.log('User unchanged, skipping profile reload');
        return;
      }

      // Seulement recharger si nécessaire
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);
        setUser(session?.user ?? null);
        lastUserId.current = newUserId;
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    });

    // Gestion de la visibilité de la page pour éviter les rechargements lors du changement de fenêtre
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && initialized.current && user) {
        // Vérifier si la session est toujours valide sans recharger le profil
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id !== lastUserId.current) {
            console.log('Session changed during visibility change, updating...');
            setUser(session?.user ?? null);
            lastUserId.current = session?.user?.id ?? null;
            
            if (session?.user) {
              fetchUserProfile(session.user.id);
            } else {
              setUserProfile(null);
            }
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array to run only once

  const handleAuthSuccess = () => {
    // Auth state change listener will handle the update
    console.log('Auth success handled by state listener');
  };

  const authContextValue: AuthContextType = {
    user,
    userProfile,
    loading,
  };

  // Show loading state during initialization or profile fetch
  if (loading || !initialized.current) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              {!initialized.current ? 'Initialisation...' : 'Chargement du profil...'}
            </p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // User not authenticated
  if (!user) {
    if (authMode === 'signup') {
      return (
        <AuthContext.Provider value={authContextValue}>
          <SignupPage
            onSwitchToLogin={() => setAuthMode('login')}
            onSignupSuccess={handleAuthSuccess}
          />
        </AuthContext.Provider>
      );
    }

    return (
      <AuthContext.Provider value={authContextValue}>
        <LoginPage
          onSwitchToSignup={() => setAuthMode('signup')}
          onLoginSuccess={handleAuthSuccess}
        />
      </AuthContext.Provider>
    );
  }

  // Profile loading error - only show if we tried to fetch profile but failed
  if (user && !userProfile && initialized.current && !loading) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Erreur de profil utilisateur
            </h2>
            <p className="text-gray-600 mb-4">
              Impossible de charger votre profil. Veuillez contacter l'administrateur.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  initialized.current = false;
                  profileCache.clear(); // Vider le cache
                  window.location.reload();
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mr-2"
              >
                Réessayer
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Check if user has admin role
  if (userProfile && userProfile.role !== 'admin') {
    return (
      <AuthContext.Provider value={authContextValue}>
        <UnauthorizedAccess />
      </AuthContext.Provider>
    );
  }

  // Authenticated admin user
  if (userProfile && userProfile.role === 'admin') {
    return (
      <AuthContext.Provider value={authContextValue}>
        {children(user)}
      </AuthContext.Provider>
    );
  }

  // Final fallback - should not happen but prevents infinite loading
  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finalisation de l'authentification...</p>
        </div>
      </div>
    </AuthContext.Provider>
  );
}