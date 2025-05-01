
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  description: string | null;
  hobbies: string[] | null;
  age: string | null;
  city: string | null;
  smoking_attitude: string | null;
  drinking_attitude: string | null;
  images: string[] | null;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}
