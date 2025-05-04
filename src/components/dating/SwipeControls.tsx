
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

interface SwipeControlsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({ onSwipe }) => {
  return (
    <div className="flex items-center justify-center gap-8 mt-8">
      <Button 
        size="lg" 
        variant="outline" 
        className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 shadow-lg transition-all duration-300 hover:scale-105"
        onClick={() => onSwipe('left')}
      >
        <X className="h-8 w-8" />
        <span className="sr-only">Пропустить</span>
      </Button>
      
      <Button 
        size="lg" 
        className="h-16 w-16 rounded-full bg-todoYellow hover:bg-todoYellow/90 text-black shadow-lg transition-all duration-300 hover:scale-105"
        onClick={() => onSwipe('right')}
      >
        <Check className="h-8 w-8" />
        <span className="sr-only">Лайк</span>
      </Button>
    </div>
  );
};
