
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
  const [dragOffset, setDragOffset] = useState(0);
  
  // Create carousel for swipes
  const [emblaRef] = useEmblaCarousel({ 
    dragFree: true,
    loop: false
  });

  // Swipe handling function
  const handleSwipe = (direction: 'left' | 'right') => {
    const username = currentUser?.username || 'пользователя';
    
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${username}!`,
        duration: isMobile ? 2000 : 3000, // Shorter duration on mobile
      });
    } else if (direction === 'left') {
      toast({
        title: "Пропуск",
        description: `Вы пропустили профиль ${username}`,
        duration: isMobile ? 2000 : 3000, // Shorter duration on mobile
      });
    }
    
    onSwipe(direction);
    setDragOffset(0); // Reset after swipe
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && dragStartX !== null) {
      const currentX = e.targetTouches[0].clientX;
      setDragEndX(currentX);
      setDragOffset(currentX - dragStartX);
    }
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null && dragEndX !== null) {
      const dragDifference = dragEndX - dragStartX;
      
      // Adjust threshold based on device
      const threshold = isMobile ? 80 : 100;
      
      if (dragDifference > threshold) {
        handleSwipe('right');
      } 
      else if (dragDifference < -threshold) {
        handleSwipe('left');
      }
    }
    
    // Reset swipe state
    setDragStartX(null);
    setDragEndX(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Calculate card rotation based on drag offset
  const cardRotation = Math.min(Math.max(dragOffset * 0.1, -10), 10);
  const cardStyle = isDragging ? {
    transform: `translateX(${dragOffset}px) rotate(${cardRotation}deg)`,
    transition: 'none'
  } : {
    transform: 'translateX(0) rotate(0deg)',
    transition: 'transform 0.3s ease'
  };

  return (
    <div className="w-full">
      <div 
        ref={emblaRef} 
        className="overflow-hidden rounded-xl shadow-lg touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex">
          <div 
            className="w-full flex-shrink-0"
            style={cardStyle}
          >
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
