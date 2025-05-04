
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/types/auth';
import { AUTH_STORAGE_PREFIX, PROFILE_CACHE_DURATION } from './types';

/**
 * Handles fetching, caching and processing of user profiles
 * Includes security measures like proper error handling and secure caching
 */
export const handleProfileAndNavigation = async (
  userId: string,
  event?: string,
  setProfile?: (profile: UserProfile) => void,
  navigate?: (path: string) => void
): Promise<UserProfile | null> => {
  try {
    if (!userId) {
      console.error('Invalid userId provided to handleProfileAndNavigation');
      return null;
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
          const profile = JSON.parse(cachedProfileData) as UserProfile;
          
          if (setProfile) {
            setProfile(profile);
          }
          
          if (navigate && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
            navigate('/');
          }
          
          return profile;
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
      if (navigate && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
        console.log('No profile found, redirecting to create-profile');
        navigate('/create-profile');
      }
      return null;
    }

    if (profile) {
      // Cache the profile with secure prefix
      try {
        localStorage.setItem(cacheKey, JSON.stringify(profile));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        
        if (setProfile) {
          setProfile(profile as UserProfile);
        }
      } catch (storageError) {
        console.error('Error storing profile in localStorage:', storageError);
        // Still update state even if caching fails
        if (setProfile) {
          setProfile(profile as UserProfile);
        }
      }
    }
    
    if (navigate && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
      if (!profile) {
        console.log('No profile found, redirecting to create-profile');
        navigate('/create-profile');
      } else {
        console.log('Profile found, redirecting to home');
        navigate('/');
      }
    }
    
    return profile as UserProfile;
  } catch (error) {
    console.error('Error in handleProfileAndNavigation:', error);
    toast.error('Ошибка загрузки профиля. Пожалуйста, попробуйте позже.');
    return null;
  }
};
