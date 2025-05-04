
import React from 'react';
import { useOtherUsers } from '@/hooks/useOtherUsers';
import { SwipeHandler } from './SwipeHandler';
import { ShareHandler } from './ShareHandler';
import { useIsMobile } from '@/hooks/use-mobile';

export interface DatingContainerProps {
  userProfile: any;
  userTestResults: any;
}

export const DatingContainer: React.FC<DatingContainerProps> = ({ 
  userProfile, 
  userTestResults 
}) => {
  const isMobile = useIsMobile();
  const {
    users,
    currentUser,
    currentIndex,
    loading,
    testResults,
    compatibilityScore,
    moveToNextUser
  } = useOtherUsers(userProfile, userTestResults);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    moveToNextUser(currentIndex);
  };
  
  // If still loading users data, DatingContainer doesn't need to show its own loading state,
  // as the parent Dating component is handling the loading state
  if (loading) {
    return null;
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${isMobile ? 'py-2 px-0' : 'py-4 px-6'} mx-auto`}>
      <h2 className={`${isMobile ? 'text-xl mb-2' : 'text-3xl mb-4'} font-bold bg-gradient-to-r from-todoYellow to-yellow-400 bg-clip-text text-transparent`}>
        Поиск попутчиков
      </h2>
      
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
        <ShareHandler onInviteFriends={() => {}} />
      )}
    </div>
  );
};
