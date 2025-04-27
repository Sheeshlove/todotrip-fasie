import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, UserProfile } from '@/lib/types/auth';
import { toast } from 'sonner';

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(s => ({ ...s, user: session?.user ?? null }));
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setState(s => ({ ...s, profile: profile as UserProfile }));
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setState(s => ({ ...s, profile: null }));
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(s => ({ ...s, user: session?.user ?? null, loading: false }));
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setState(s => ({ ...s, profile: profile as UserProfile }));
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Успешный вход');
      navigate('/profile');
    } catch (error) {
      toast.error('Ошибка входа: ' + (error as Error).message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      toast.success('Регистрация успешна!');
      navigate('/profile');
    } catch (error) {
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
