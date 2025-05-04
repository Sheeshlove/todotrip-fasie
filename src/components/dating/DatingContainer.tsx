
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
  
  return (
    <div className={`flex flex-col items-center justify-center py-4 ${isMobile ? 'px-2' : 'px-6'} mx-auto`}>
      <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4 bg-gradient-to-r from-todoYellow to-yellow-400 bg-clip-text text-transparent`}>
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
