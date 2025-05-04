
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AUTH_STORAGE_PREFIX } from './types';

/**
 * Signs in a user with email and password
 * Includes security validation and error handling
 */
export const signIn = async (email: string, password: string, checkRateLimit?: () => void): Promise<void> => {
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
    if (checkRateLimit) {
      checkRateLimit();
    }

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

/**
 * Signs up a user with email, password and optional metadata
 * Includes security validation and error handling
 */
export const signUp = async (
  email: string, 
  password: string, 
  metadata?: { [key: string]: any },
  checkRateLimit?: () => void
): Promise<void> => {
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
    if (checkRateLimit) {
      checkRateLimit();
    }

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

/**
 * Signs out a user and clears secure cache
 * Includes proper error handling
 */
export const signOut = async (navigate?: (path: string) => void): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear secure cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(AUTH_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    if (navigate) {
      navigate('/login');
    }
    
    toast.success('Вы успешно вышли из системы');
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error('Ошибка выхода: ' + (error as Error).message);
    throw error;
  }
};

/**
 * Refreshes the current user session
 * Important for maintaining authentication state
 */
export const refreshSession = async (): Promise<{user: any, error: any}> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { user: data.session?.user ?? null, error: null };
  } catch (error) {
    console.error('Session refresh error:', error);
    return { user: null, error };
  }
};
