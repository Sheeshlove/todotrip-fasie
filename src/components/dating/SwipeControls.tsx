
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeControlsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({ onSwipe }) => {
  const isMobile = useIsMobile();
  
  const buttonSize = isMobile ? "h-12 w-12" : "h-16 w-16";
  const iconSize = isMobile ? 20 : 24;
  
  return (
    <div className={`flex items-center justify-center ${isMobile ? 'gap-6 mt-3' : 'gap-8 mt-6'}`}>
      <Button 
        size="lg" 
        variant="outline" 
        className={`${buttonSize} rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
        onClick={() => onSwipe('left')}
      >
        <X size={iconSize} />
        <span className="sr-only">Пропустить</span>
      </Button>
      
      <Button 
        size="lg" 
        className={`${buttonSize} rounded-full bg-todoYellow hover:bg-todoYellow/90 text-black shadow-lg transition-all duration-300 hover:scale-105 active:scale-95`}
        onClick={() => onSwipe('right')}
      >
        <Check size={iconSize} />
        <span className="sr-only">Лайк</span>
      </Button>
    </div>
  );
};
