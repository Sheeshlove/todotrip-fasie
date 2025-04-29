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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory cache with expiration
const profileCache = new Map<string, {data: UserProfile, expiry: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });
  const navigate = useNavigate();

  // Rate limiting configuration
  const { checkRateLimit, isLocked, remainingAttempts } = useRateLimit({
    maxAttempts: 5,
    timeWindow: 5 * 60 * 1000, // 5 minutes
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  });

  // Memoize the profile fetch function to avoid recreating it on every render
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profile) {
        // Store in in-memory cache with current timestamp
        const now = Date.now();
        profileCache.set(userId, {
          data: profile as UserProfile,
          expiry: now + CACHE_TTL
        });
        
        return profile as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);

  const handleProfileAndNavigation = useCallback(async (userId: string, event?: string) => {
    try {
      // Check in-memory cache first for better performance
      const now = Date.now();
      const cachedProfile = profileCache.get(userId);
      
      if (cachedProfile && now < cachedProfile.expiry) {
        setState(s => ({ ...s, profile: cachedProfile.data }));
        
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          navigate('/');
        }
        return;
      }
      
      // Fetch profile if not cached or expired
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        setState(s => ({ ...s, profile }));
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        if (!profile) {
          navigate('/create-profile');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error in handleProfileAndNavigation:', error);
    }
  }, [fetchUserProfile, navigate]);

  useEffect(() => {
    // Flag to prevent state updates if the component unmounts
    let isMounted = true;
    
    // Setup auth state listener
    const setupAuth = async () => {
      try {
        // Set up auth state listener and capture session in parallel
        const authListener = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) return;
          
          setState(s => ({ ...s, user: session?.user ?? null }));
          
          if (session?.user) {
            handleProfileAndNavigation(session.user.id, event);
          } else {
            setState(s => ({ ...s, profile: null }));
            if (event === 'SIGNED_OUT') {
              navigate('/login');
            }
          }
        });
        
        // Process initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setState(s => ({ 
            ...s, 
            user: session?.user ?? null, 
            loading: false 
          }));
          
          if (session?.user) {
            handleProfileAndNavigation(session.user.id);
          }
        }
        
        return authListener;
      } catch (error) {
        console.error('Auth setup error:', error);
        if (isMounted) {
          setState(s => ({ ...s, loading: false }));
        }
        return { subscription: { unsubscribe: () => {} } };
      }
    };
    
    // Initialize auth
    const authPromise = setupAuth();
    
    // Cleanup
    return () => {
      isMounted = false;
      authPromise.then(subscription => {
        subscription.subscription.unsubscribe();
      });
    };
  }, [navigate, handleProfileAndNavigation]);

  const signIn = async (email: string, password: string) => {
    try {
      // Check rate limit before attempting sign in
      checkRateLimit();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Неверный email или пароль');
        } else {
          toast.error('Ошибка входа. Пожалуйста, попробуйте позже.');
        }
        throw error;
      }

      toast.success('Успешный вход');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Too many attempts')) {
          toast.error(error.message);
        } else {
          toast.error('Ошибка входа: ' + error.message);
        }
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      // Check rate limit before attempting sign up
      checkRateLimit();

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('Пользователь с таким email уже зарегистрирован');
        } else {
          toast.error('Ошибка регистрации. Пожалуйста, попробуйте позже.');
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear profile cache
      if (state.user?.id) {
        profileCache.delete(state.user.id);
      }
      
      setState({ user: null, profile: null, loading: false });
      
      navigate('/login');
      
      toast.success('Вы успешно вышли ��з системы');
    } catch (error) {
      toast.error('Ошибка выхода: ' + (error as Error).message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
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
