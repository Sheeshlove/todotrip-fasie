
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeControlsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({ onSwipe }) => {
  const isMobile = useIsMobile();
  
  const buttonSize = isMobile ? "h-14 w-14" : "h-16 w-16";
  const iconSize = isMobile ? "h-6 w-6" : "h-8 w-8";
  
  return (
    <div className={`flex items-center justify-center ${isMobile ? 'gap-5 mt-4' : 'gap-8 mt-6'}`}>
      <Button 
        size="lg" 
        variant="outline" 
        className={`${buttonSize} rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
        onClick={() => onSwipe('left')}
      >
        <X className={iconSize} />
        <span className="sr-only">Пропустить</span>
      </Button>
      
      <Button 
        size="lg" 
        className={`${buttonSize} rounded-full bg-todoYellow hover:bg-todoYellow/90 text-black shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
        onClick={() => onSwipe('right')}
      >
        <Check className={iconSize} />
        <span className="sr-only">Лайк</span>
      </Button>
    </div>
  );
};
