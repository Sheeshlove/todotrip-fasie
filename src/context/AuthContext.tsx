
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, UserProfile } from '@/lib/types/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useRateLimit } from '@/hooks/useRateLimit';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants for security settings
const PROFILE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const AUTH_STORAGE_PREFIX = 'todotrip_secure_'; // Prefix for localStorage keys

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

  // Secure profile handling with proper error handling
  const handleProfileAndNavigation = useCallback(async (userId: string, event?: string) => {
    try {
      if (!userId) {
        console.error('Invalid userId provided to handleProfileAndNavigation');
        return;
      }

      // Use localStorage with secure prefix for caching
      const cacheKey = `${AUTH_STORAGE_PREFIX}profile_${userId}`;
      const cacheTimeKey = `${AUTH_STORAGE_PREFIX}profile_${userId}_time`;
      
      const cachedProfileData = localStorage.getItem(cacheKey);
      const cachedProfileTime = localStorage.getItem(cacheTimeKey);
      
      // Use cached profile if recent and valid
      if (cachedProfileData && cachedProfileTime) {
        try {
          const cacheAge = Date.now() - parseInt(cachedProfileTime);
          if (cacheAge < PROFILE_CACHE_DURATION) {
            const profile = JSON.parse(cachedProfileData);
            setState(s => ({ ...s, profile: profile as UserProfile }));
            
            if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
              navigate('/');
            }
            return;
          }
        } catch (parseError) {
          // If parsing fails, fetch fresh data
          console.error('Error parsing cached profile data:', parseError);
        }
      }
      
      // Fetch fresh profile data with proper error handling
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          console.log('No profile found, redirecting to create-profile');
          navigate('/create-profile');
          return;
        }
      }

      if (profile) {
        // Cache the profile with secure prefix
        try {
          localStorage.setItem(cacheKey, JSON.stringify(profile));
          localStorage.setItem(cacheTimeKey, Date.now().toString());
          
          setState(s => ({ ...s, profile: profile as UserProfile }));
        } catch (storageError) {
          console.error('Error storing profile in localStorage:', storageError);
          // Still update state even if caching fails
          setState(s => ({ ...s, profile: profile as UserProfile }));
        }
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        if (!profile) {
          console.log('No profile found, redirecting to create-profile');
          navigate('/create-profile');
        } else {
          console.log('Profile found, redirecting to home');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error in handleProfileAndNavigation:', error);
      toast.error('Ошибка загрузки профиля. Пожалуйста, попробуйте позже.');
    }
  }, [navigate]);

  // Session refresh functionality for enhanced security
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setState(s => ({ ...s, user: data.session.user }));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setIsAuthenticated(false);
    }
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
              handleProfileAndNavigation(session.user.id, event);
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
            handleProfileAndNavigation(session.user.id);
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
  }, [navigate, handleProfileAndNavigation, isAuthenticated, refreshSession]);

  // Enhanced secure sign in with proper validation
  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!email || !password) {
        toast.error('Пожалуйста, введите email и пароль');
        return;
      }

      if (email.trim() === '' || password.trim() === '') {
        toast.error('Email и пароль не могут быть пустыми');
        return;
      }

      // Check rate limit before attempting sign in
      checkRateLimit();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Неверный email или пароль');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Пожалуйста, подтвердите свой email перед входом');
        } else {
          toast.error('Ошибка входа. Пожалуйста, попробуйте позже.');
        }
        throw error;
      }

      toast.success('Успешный вход');
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Too many attempts')) {
          toast.error(error.message);
        } else {
          toast.error('Ошибка входа: ' + error.message);
        }
      }
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Enhanced secure sign up with proper validation
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      // Input validation
      if (!email || !password) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      if (email.trim() === '' || password.trim() === '') {
        toast.error('Email и пароль не могут быть пустыми');
        return;
      }

      // Password strength validation
      if (password.length < 8) {
        toast.error('Пароль должен содержать минимум 8 символов');
        return;
      }

      // Check rate limit before attempting sign up
      checkRateLimit();

      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('Пользователь с таким email уже зарегистрирован');
        } else {
          toast.error('Ошибка регистрации: ' + error.message);
        }
        throw error;
      }
      
      console.log('Signup successful:', data);
      toast.success('Регистрация успешна!');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Too many attempts')) {
          toast.error(error.message);
        } else {
          toast.error('Ошибка регистрации: ' + error.message);
        }
      }
      throw error;
    }
  };

  // Secure sign out with proper error handling
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear secure cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(AUTH_STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      
      setState({ user: null, profile: null, loading: false });
      setIsAuthenticated(false);
      
      navigate('/login');
      
      toast.success('Вы успешно вышли из системы');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Ошибка выхода: ' + (error as Error).message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      signIn, 
      signUp, 
      signOut,
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
