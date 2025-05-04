
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwipeControls } from './SwipeControls';
import { UserCard } from './UserCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
    const username = currentUser?.username || 'пользователя';
    
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${username}!`,
      });
    } else if (direction === 'left') {
      toast({
        title: "Пропуск",
        description: `Вы пропустили профиль ${username}`,
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
      
      // If difference is more than 80px on mobile or 100px on desktop, consider it a swipe right (Like)
      // Если разница больше 80px на мобильном или 100px на десктопе, считаем это свайпом вправо (Like)
      const threshold = isMobile ? 80 : 100;
      
      if (dragDifference > threshold) {
        handleSwipe('right');
      } 
      // If difference is less than -80px on mobile or -100px on desktop, consider it a swipe left (Skip)
      // Если разница меньше -80px на мобильном или -100px на десктопе, считаем это свайпом влево (Skip)
      else if (dragDifference < -threshold) {
        handleSwipe('left');
      }
    }
    
    // Reset swipe state
    // Сбрасываем состояние свайпа
    setDragStartX(null);
    setDragEndX(null);
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <div 
        ref={emblaRef} 
        className="overflow-hidden rounded-xl shadow-lg"
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
