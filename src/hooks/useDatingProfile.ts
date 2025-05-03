
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfileData {
  profile: any;
  testResults: any;
  loading: boolean;
  error: Error | null;
}

export const useDatingProfile = (): UserProfileData => {
  const { user } = useAuth();
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
