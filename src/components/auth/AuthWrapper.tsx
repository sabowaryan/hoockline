import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { UnauthorizedAccess } from './UnauthorizedAccess';

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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, create one with default role
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile...');
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              role: 'user' // Default role
            })
            .select('id, role, created_at, updated_at')
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setUserProfile(null);
          } else {
            console.log('Created new profile:', newProfile);
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(null);
        }
      } else {
        console.log('Profile found:', data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (mounted) {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    // The auth state change listener will handle updating the user and profile
  };

  const authContextValue: AuthContextType = {
    user,
    userProfile,
    loading,
  };

  if (loading) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

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

  // User is authenticated, check if profile exists and has admin role
  if (!userProfile) {
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
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Check if user has admin role
  if (userProfile.role !== 'admin') {
    return (
      <AuthContext.Provider value={authContextValue}>
        <UnauthorizedAccess />
      </AuthContext.Provider>
    );
  }

  // User is authenticated and has admin role
  return (
    <AuthContext.Provider value={authContextValue}>
      {children(user)}
    </AuthContext.Provider>
  );
}