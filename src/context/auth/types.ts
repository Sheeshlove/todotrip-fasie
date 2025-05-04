
import { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/types/auth';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

// Constants for security settings
export const PROFILE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
export const AUTH_STORAGE_PREFIX = 'todotrip_secure_'; // Prefix for localStorage keys
