
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwipeControls } from './SwipeControls';
import { UserCard } from './UserCard';
import useEmblaCarousel from 'embla-carousel-react';

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
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Создаем карусель для свайпов (Create carousel for swipes)
  const [emblaRef] = useEmblaCarousel({ 
    dragFree: true,
    loop: false
  });

  // Функция обработки свайпа (Swipe handling function)
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${currentUser?.username || 'пользователя'}!`,
      });
    }
    
    onSwipe(direction);
  };

  // Touch/Swipe handlers (Обработчики касания/свайпа)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setDragEndX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragEndX !== null) {
      const dragDifference = dragEndX - dragStartX;
      
      // Если разница больше 100px, считаем это свайпом вправо (Like)
      // If difference is more than 100px, consider it a swipe right (Like)
      if (dragDifference > 100) {
        handleSwipe('right');
      } 
      // Если разница меньше -100px, считаем это свайпом влево (Skip)
      // If difference is less than -100px, consider it a swipe left (Skip)
      else if (dragDifference < -100) {
        handleSwipe('left');
      }
    }
    
    // Сбрасываем состояние свайпа
    // Reset swipe state
    setDragStartX(null);
    setDragEndX(null);
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-md">
      <div 
        ref={emblaRef} 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex">
          <div className="w-full flex-shrink-0">
            <UserCard 
              user={currentUser} 
              currentUserHobbies={currentUserHobbies} 
              compatibilityScore={compatibilityScore}
              currentUserHasTakenTest={currentUserHasTakenTest}
              userHasTakenTest={userHasTakenTest}
            />
          </div>
        </div>
      </div>
      <SwipeControls onSwipe={handleSwipe} />
    </div>
  );
};
