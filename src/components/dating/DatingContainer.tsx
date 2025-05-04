
import React from 'react';
import { useOtherUsers } from '@/hooks/useOtherUsers';
import { SwipeHandler } from './SwipeHandler';
import { ShareHandler } from './ShareHandler';

export interface DatingContainerProps {
  userProfile: any;
  userTestResults: any;
}

export const DatingContainer: React.FC<DatingContainerProps> = ({ 
  userProfile, 
  userTestResults 
}) => {
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
  
  // We've removed the inner loading state since it's now handled at the page level
  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-todoYellow to-yellow-400 bg-clip-text text-transparent">
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
