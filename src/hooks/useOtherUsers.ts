
import { useState, useEffect } from 'react';
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
  const calculateCurrentUserCompatibility = (nextUser: any) => {
    if (userTestResults && otherUsersTestResults[nextUser.id]) {
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
  };

  // Fetch other users' profiles and test results
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
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
    
    if (userProfile?.id) {
      fetchUsers();
    }
  }, [userProfile, toast, userTestResults]);

  // Function to move to next user and calculate compatibility
  const moveToNextUser = (currentIndex: number) => {
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
  };

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
