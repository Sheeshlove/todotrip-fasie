
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
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <p className="text-white text-lg">Загрузка профилей...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-6">
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
