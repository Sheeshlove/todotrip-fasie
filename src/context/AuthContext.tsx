import { createContext, useContext, useEffect, useState } from 'react';
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
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const handleProfileAndNavigation = async (userId: string, event?: string) => {
    try {
      // Use localStorage to check if we've recently fetched this profile
      const cachedProfileData = localStorage.getItem(`profile_${userId}`);
      const cachedProfileTime = localStorage.getItem(`profile_${userId}_time`);
      
      // If we have a cached profile and it's less than 5 minutes old, use it
      if (cachedProfileData && cachedProfileTime) {
        const cacheAge = Date.now() - parseInt(cachedProfileTime);
        if (cacheAge < 5 * 60 * 1000) { // 5 minutes
          const profile = JSON.parse(cachedProfileData);
          setState(s => ({ ...s, profile: profile as UserProfile }));
          
          if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
            navigate('/');
          }
          return;
        }
      }
      
      // Otherwise fetch from API
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
        // Cache the profile in localStorage
        localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
        localStorage.setItem(`profile_${userId}_time`, Date.now().toString());
        
        setState(s => ({ ...s, profile: profile as UserProfile }));
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
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setState(s => ({ ...s, user: session?.user ?? null }));
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(() => {
            handleProfileAndNavigation(session.user.id, event);
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
      setState(s => ({ ...s, user: session?.user ?? null, loading: false }));
      if (session?.user) {
        // Defer Supabase calls with setTimeout
        setTimeout(() => {
          handleProfileAndNavigation(session.user.id);
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      
      setState({ user: null, profile: null, loading: false });
      
      navigate('/login');
      
      toast.success('Вы успешно вышли из системы');
    } catch (error) {
      toast.error('Ошибка выхода: ' + (error as Error).message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      checkRateLimit();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      
      if (error) throw error;
      
      toast.success('Инструкции по восстановлению пароля отправлены на ваш email');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Ошибка восстановления пароля: ' + error.message);
      }
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      toast.success('Пароль успешно изменен');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Ошибка изменения пароля: ' + error.message);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      updatePassword 
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
