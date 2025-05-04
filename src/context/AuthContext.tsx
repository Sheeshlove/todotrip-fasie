
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/lib/types/auth';
import { useNavigate } from 'react-router-dom';
import { useRateLimit } from '@/hooks/useRateLimit';
import { AuthState, AuthContextType } from './auth/types';
import { handleProfileAndNavigation } from './auth/profileUtils';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, refreshSession as authRefreshSession } from './auth/authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security-enhanced AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Enhanced rate limiting configuration
  const { checkRateLimit } = useRateLimit({
    maxAttempts: 5,
    timeWindow: 5 * 60 * 1000, // 5 minutes
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  });

  // Session refresh functionality for enhanced security
  const refreshSession = useCallback(async () => {
    try {
      const { user, error } = await authRefreshSession();
      if (error) throw error;
      if (user) {
        setState(s => ({ ...s, user }));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setIsAuthenticated(false);
    }
  }, []);

  // Callback to update profile in state
  const updateProfile = useCallback((profile: UserProfile) => {
    setState(s => ({ ...s, profile }));
  }, []);

  // Enhanced authentication state management
  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        
        setIsAuthenticated(!!session?.user);
        setState(s => ({ ...s, user: session?.user ?? null }));
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(() => {
            if (mounted) {
              handleProfileAndNavigation(session.user.id, event, updateProfile, navigate);
            }
          }, 0);
        } else {
          setState(s => ({ ...s, profile: null }));
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setIsAuthenticated(!!session?.user);
      setState(s => ({ ...s, user: session?.user ?? null, loading: false }));
      
      if (session?.user) {
        // Defer Supabase calls with setTimeout
        setTimeout(() => {
          if (mounted) {
            handleProfileAndNavigation(session.user.id, undefined, updateProfile, navigate);
          }
        }, 0);
      }
    });

    // Auto refresh session periodically for security
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        refreshSession();
      }
    }, 60 * 60 * 1000); // Refresh every hour

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [navigate, updateProfile, isAuthenticated, refreshSession]);

  // Adapters for auth operations
  const handleSignIn = async (email: string, password: string) => {
    try {
      await authSignIn(email, password, checkRateLimit);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    return authSignUp(email, password, metadata, checkRateLimit);
  };

  const handleSignOut = async () => {
    try {
      await authSignOut(navigate);
      setState({ user: null, profile: null, loading: false });
      setIsAuthenticated(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      signIn: handleSignIn, 
      signUp: handleSignUp, 
      signOut: handleSignOut,
      refreshSession,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
