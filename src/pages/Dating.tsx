import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserCard } from '@/components/dating/UserCard';
import { useAuth } from '@/context/AuthContext';
import { SwipeControls } from '@/components/dating/SwipeControls';
import { EmptyState } from '@/components/dating/EmptyState';
import { calculateCompatibility, getCompatibilityAnalysis } from '@/services/compatibilityService';

const Dating = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userTestResults, setUserTestResults] = useState<any>(null);
  const [otherUsersTestResults, setOtherUsersTestResults] = useState<Record<string, any>>({});
  const [compatibilityScore, setCompatibilityScore] = useState(100);
  const [compatibilityAnalysis, setCompatibilityAnalysis] = useState<Record<string, string>>({});
  
  // Fetch user's profile and test results
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setUserProfile(profile);
        
        // Fetch test results
        const { data: testResults, error: testError } = await supabase
          .from('ocean_test_results')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (testError) throw testError;
        setUserTestResults(testResults);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Fetch other users' profiles and test results
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch other users' profiles
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
          
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
              const score = calculateCompatibility(userTestResults, testResultsMap[usersData[0].id]);
              setCompatibilityScore(score);
              
              const analysis = getCompatibilityAnalysis(userTestResults, testResultsMap[usersData[0].id]);
              setCompatibilityAnalysis(analysis);
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
  }, [user, toast, userTestResults]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    // Here you would implement actual matching logic
    // For now, we'll just simulate the swipe
    
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${currentUser?.username || 'пользователя'}!`,
      });
    }
    
    // Move to the next profile
    if (currentIndex < users.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextUser = users[nextIndex];
      setCurrentIndex(nextIndex);
      setCurrentUser(nextUser);
      
      // Calculate compatibility for the next user
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
    } else {
      // No more profiles to show
      setCurrentUser(null);
    }
  };
  
  const handleInviteFriends = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: 'ToDoTrip - AI Travel App',
        text: 'Join me on ToDoTrip, an AI-powered travel app for planning trips around Russia!',
        url: window.location.origin,
      }).then(() => {
        toast({
          title: "Успешно!",
          description: "Приглашение отправлено.",
        });
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(
      `Join me on ToDoTrip, an AI-powered travel app for planning trips around Russia! ${url}`
    );
    toast({
      title: "Ссылка скопирована!",
      description: "Теперь вы можете отправить её друзьям.",
    });
  };
  
  if (loading) {
    return (
      <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <p className="text-white text-lg">Загрузка профилей...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-6">
        {users.length > 0 && currentUser ? (
          <div className="w-full max-w-md">
            <UserCard 
              user={currentUser} 
              currentUserHobbies={userProfile?.hobbies || []} 
              compatibilityScore={compatibilityScore}
              currentUserHasTakenTest={!!userTestResults}
              userHasTakenTest={!!otherUsersTestResults[currentUser.id]}
            />
            <SwipeControls onSwipe={handleSwipe} />
          </div>
        ) : (
          <EmptyState onInviteFriends={handleInviteFriends} />
        )}
      </div>
    </PageLayout>
  );
};

export default Dating;
