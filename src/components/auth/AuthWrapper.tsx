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
  const [profileLoading, setProfileLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // The auth state change listener will handle updating the user and profile
  };

  const authContextValue: AuthContextType = {
    user,
    userProfile,
    loading: loading || profileLoading,
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

  // User is authenticated, check if profile is loading
  if (profileLoading) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Vérification des permissions...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Check if user has admin role
  if (!userProfile || userProfile.role !== 'admin') {
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