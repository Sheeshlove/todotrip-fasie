
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfileData {
  profile: any;
  testResults: any;
  loading: boolean;
  error: Error | null;
}

// Cache for user data to prevent redundant fetches
const userDataCache: Record<string, {
  profile: any;
  testResults: any;
  timestamp: number;
}> = {};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const useDatingProfile = (): UserProfileData => {
  const { user, signIn } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Verify we have a valid session before proceeding
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn('No active session found in useDatingProfile, images may not load correctly');
      }
      
      // Check if we have valid cached data
      const cachedData = userDataCache[user.id];
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp) < CACHE_EXPIRATION) {
        // Use cached data if it's still valid
        setProfile(cachedData.profile);
        setTestResults(cachedData.testResults);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch test results
        const { data: testData, error: testError } = await supabase
          .from('ocean_test_results')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (testError) throw testError;
        setTestResults(testData);
        
        // Cache the fetched data
        userDataCache[user.id] = {
          profile: profileData,
          testResults: testData,
          timestamp: now
        };
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  return { profile, testResults, loading, error };
};
