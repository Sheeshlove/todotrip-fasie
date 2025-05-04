
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateCompatibility, getCompatibilityAnalysis } from '@/services/compatibilityService';

export interface OtherUsersData {
  users: any[];
  currentUser: any | null;
  currentIndex: number;
  loading: boolean;
  testResults: Record<string, any>;
  compatibilityScore: number;
  compatibilityAnalysis: Record<string, string>;
}

// Cache for other users data
const othersCache: {
  data: any[] | null;
  testResults: Record<string, any> | null;
  timestamp: number;
} = {
  data: null,
  testResults: null,
  timestamp: 0
};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const useOtherUsers = (userProfile: any, userTestResults: any) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otherUsersTestResults, setOtherUsersTestResults] = useState<Record<string, any>>({});
  const [compatibilityScore, setCompatibilityScore] = useState(100);
  const [compatibilityAnalysis, setCompatibilityAnalysis] = useState<Record<string, string>>({});

  // Функция расчета совместимости с текущим пользователем
  // Function to calculate compatibility with current user
  const calculateCurrentUserCompatibility = useCallback((nextUser: any) => {
    if (userTestResults && otherUsersTestResults[nextUser?.id]) {
      const score = calculateCompatibility(userTestResults, otherUsersTestResults[nextUser.id]);
      setCompatibilityScore(score);
      
      const analysis = getCompatibilityAnalysis(userTestResults, otherUsersTestResults[nextUser.id]);
      setCompatibilityAnalysis(analysis);
    } else {
      setCompatibilityScore(75); // Default score when no data
      setCompatibilityAnalysis({
        overall: "Недостаточно данных для полного анализа совместимости. Предложите пройти тест личности."
      });
    }
  }, [userTestResults, otherUsersTestResults]);

  // Fetch other users' profiles and test results
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Check if cache is valid
        const now = Date.now();
        if (othersCache.data && othersCache.testResults && (now - othersCache.timestamp) < CACHE_EXPIRATION) {
          // Use cached data
          setUsers(othersCache.data);
          setOtherUsersTestResults(othersCache.testResults);
          
          if (othersCache.data.length > 0) {
            setCurrentUser(othersCache.data[0]);
            calculateCurrentUserCompatibility(othersCache.data[0]);
          }
          
          setLoading(false);
          return;
        }
        
        // Fetch other users' profiles
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', userProfile?.id);
          
        if (usersError) throw usersError;
        
        // Fetch all test results
        if (usersData && usersData.length > 0) {
          const userIds = usersData.map(user => user.id);
          
          const { data: testResults, error: testResultsError } = await supabase
            .from('ocean_test_results')
            .select('*')
            .in('user_id', userIds);
            
          if (testResultsError) throw testResultsError;
          
          // Create a map of user IDs to test results
          const testResultsMap: Record<string, any> = {};
          if (testResults) {
            testResults.forEach(result => {
              testResultsMap[result.user_id] = result;
            });
          }
          
          // Update cache
          othersCache.data = usersData;
          othersCache.testResults = testResultsMap;
          othersCache.timestamp = now;
          
          setOtherUsersTestResults(testResultsMap);
          setUsers(usersData);
          
          if (usersData.length > 0) {
            setCurrentUser(usersData[0]);
            
            // Calculate initial compatibility
            if (userTestResults && testResultsMap[usersData[0].id]) {
              calculateCurrentUserCompatibility(usersData[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Ошибка!",
          description: "Не удалось загрузить пользователей.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [userProfile?.id, toast, userTestResults, calculateCurrentUserCompatibility]);

  // Function to move to next user and calculate compatibility
  const moveToNextUser = useCallback((currentIndex: number) => {
    if (currentIndex < users.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextUser = users[nextIndex];
      setCurrentIndex(nextIndex);
      setCurrentUser(nextUser);
      
      // Calculate compatibility for the next user
      calculateCurrentUserCompatibility(nextUser);
      
      return nextUser;
    }
    
    // No more profiles to show
    setCurrentUser(null);
    return null;
  }, [users, calculateCurrentUserCompatibility]);

  return {
    users,
    currentUser,
    currentIndex,
    loading,
    testResults: otherUsersTestResults,
    compatibilityScore,
    compatibilityAnalysis,
    setCurrentIndex,
    moveToNextUser
  };
};
