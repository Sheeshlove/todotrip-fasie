
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
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimatingExit, setIsAnimatingExit] = useState(false);
  
  // Create carousel for swipes
  const [emblaRef] = useEmblaCarousel({ 
    dragFree: true,
    loop: false
  });

  // Enhanced swipe handling function with animation
  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimatingExit) return; // Prevent multiple swipes during animation
    
    setExitDirection(direction);
    setIsAnimatingExit(true);
    
    // Delay actual swipe handling until animation finishes
    setTimeout(() => {
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
      setDragOffset(0);
      setExitDirection(null);
      setIsAnimatingExit(false);
    }, 300); // Match duration with CSS transition
  };

  // Touch/Swipe handlers with improved sensitivity
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingExit) return; // Prevent new touches during exit animation
    setDragStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && dragStartX !== null && !isAnimatingExit) {
      const currentX = e.targetTouches[0].clientX;
      setDragEndX(currentX);
      setDragOffset(currentX - dragStartX);
    }
  };

  const handleTouchEnd = () => {
    if (isAnimatingExit) return;
    
    if (dragStartX !== null && dragEndX !== null) {
      const dragDifference = dragEndX - dragStartX;
      
      // Adjust threshold based on device
      const threshold = isMobile ? 60 : 100;
      
      if (dragDifference > threshold) {
        handleSwipe('right');
      } 
      else if (dragDifference < -threshold) {
        handleSwipe('left');
      } else {
        // If not passing threshold, animate back to center
        setDragOffset(0);
      }
    }
    
    // Reset swipe state
    setDragStartX(null);
    setDragEndX(null);
    setIsDragging(false);
  };

  // Calculate card rotation based on drag offset
  const cardRotation = Math.min(Math.max(dragOffset * 0.1, -10), 10);
  
  // Dynamic card styling based on state
  const getCardStyle = () => {
    if (isAnimatingExit) {
      // Exit animation
      const translateX = exitDirection === 'left' ? '-120%' : '120%';
      const rotate = exitDirection === 'left' ? '-20deg' : '20deg';
      return {
        transform: `translateX(${translateX}) rotate(${rotate})`,
        transition: 'transform 0.3s ease-out',
        opacity: 0
      };
    } else if (isDragging) {
      // Dragging state
      return {
        transform: `translateX(${dragOffset}px) rotate(${cardRotation}deg)`,
        transition: 'none'
      };
    } else {
      // Neutral state or return-to-center animation
      return {
        transform: 'translateX(0) rotate(0deg)',
        transition: 'transform 0.3s ease-out'
      };
    }
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
            className="w-full flex-shrink-0 animate-fade-in"
            style={getCardStyle()}
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
      <div className={`animate-fade-in transition-opacity duration-300 ${isAnimatingExit ? 'opacity-50' : 'opacity-100'}`}>
        <SwipeControls onSwipe={handleSwipe} />
      </div>
    </div>
  );
};
