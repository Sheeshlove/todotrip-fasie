import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, UserProfile } from '@/lib/types/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });
  const navigate = useNavigate();

  const handleProfileAndNavigation = async (userId: string, event?: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          console.log('No profile found, redirecting to create-profile');
          navigate('/create-profile');
          return;
        }
      }

      setState(s => ({ ...s, profile: profile as UserProfile }));
      
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setState(s => ({ ...s, user: session?.user ?? null }));
        
        if (session?.user) {
          await handleProfileAndNavigation(session.user.id, event);
        } else {
          setState(s => ({ ...s, profile: null }));
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(s => ({ ...s, user: session?.user ?? null, loading: false }));
      if (session?.user) {
        handleProfileAndNavigation(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Успешный вход');
    } catch (error) {
      toast.error('Ошибка входа: ' + (error as Error).message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      console.log('Signup successful:', data);
      toast.success('Регистрация успешна!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Ошибка регистрации: ' + (error as Error).message);
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
