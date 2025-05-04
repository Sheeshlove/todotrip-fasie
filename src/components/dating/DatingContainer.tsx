
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-pulse">
          <div className="w-10 h-10 bg-todoYellow/30 rounded-full mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Загрузка профилей...</p>
        </div>
      </div>
    );
  }
  
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
