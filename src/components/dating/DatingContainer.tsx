
import React, { useEffect } from 'react';
import { useOtherUsers } from '@/hooks/useOtherUsers';
import { SwipeHandler } from './SwipeHandler';
import { ShareHandler } from './ShareHandler';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface DatingContainerProps {
  userProfile: any;
  userTestResults: any;
}

export const DatingContainer: React.FC<DatingContainerProps> = ({ 
  userProfile, 
  userTestResults 
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const {
    users,
    currentUser,
    currentIndex,
    loading,
    testResults,
    compatibilityScore,
    moveToNextUser
  } = useOtherUsers(userProfile, userTestResults);
  
  // Check authentication status on mount to ensure images can load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session && user) {
        toast.warning('Для корректного отображения фотографий может потребоваться повторный вход', {
          duration: 5000
        });
      }
    };
    
    checkAuthStatus();
  }, [user]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    moveToNextUser(currentIndex);
  };
  
  // If still loading users data, DatingContainer doesn't need to show its own loading state,
  // as the parent Dating component is handling the loading state
  if (loading) {
    return null;
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${isMobile ? 'py-2 px-0' : 'py-4 px-6'} mx-auto animate-fade-in`}>
      <h2 className={`${isMobile ? 'text-xl mb-2' : 'text-3xl mb-4'} font-bold bg-gradient-to-r from-todoYellow to-yellow-400 bg-clip-text text-transparent animate-fade-in`}>
        Поиск попутчиков
      </h2>
      
      <div className="w-full transition-all duration-500">
        {users.length > 0 && currentUser ? (
          <SwipeHandler 
            currentUser={currentUser} 
            currentUserHobbies={userProfile?.hobbies || []} 
            compatibilityScore={compatibilityScore}
            currentUserHasTakenTest={!!userTestResults}
            userHasTakenTest={!!testResults[currentUser.id]}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="animate-fade-in">
            <ShareHandler onInviteFriends={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
};
