
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwipeControls } from './SwipeControls';
import { UserCard } from './UserCard';

interface SwipeHandlerProps {
  currentUser: any;
  currentUserHobbies: string[];
  compatibilityScore: number;
  currentUserHasTakenTest: boolean;
  userHasTakenTest: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeHandler: React.FC<SwipeHandlerProps> = ({
  currentUser,
  currentUserHobbies,
  compatibilityScore,
  currentUserHasTakenTest,
  userHasTakenTest,
  onSwipe
}) => {
  const { toast } = useToast();

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${currentUser?.username || 'пользователя'}!`,
      });
    }
    
    onSwipe(direction);
  };

  return (
    <div className="w-full max-w-md">
      <UserCard 
        user={currentUser} 
        currentUserHobbies={currentUserHobbies} 
        compatibilityScore={compatibilityScore}
        currentUserHasTakenTest={currentUserHasTakenTest}
        userHasTakenTest={userHasTakenTest}
      />
      <SwipeControls onSwipe={handleSwipe} />
    </div>
  );
};
