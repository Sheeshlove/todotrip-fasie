
import React, { useEffect, useState } from 'react';
import { getCompatibilityBgColor } from '@/services/compatibilityService';
import { Progress } from '@/components/ui/progress';

interface CompatibilityCircleProps {
  compatibilityScore: number;
  currentUserHasTakenTest: boolean;
  userHasTakenTest: boolean;
  username?: string;
}

export const CompatibilityCircle: React.FC<CompatibilityCircleProps> = ({
  compatibilityScore,
  currentUserHasTakenTest,
  userHasTakenTest,
  username
}) => {
  // Анимация заполнения круга (Circle fill animation)
  const [progress, setProgress] = useState(0);
  
  // Get compatibility color classes based on score
  const compatibilityBgClass = getCompatibilityBgColor(compatibilityScore);

  // Get the text for the compatibility circle
  const getCompatibilityText = () => {
    if (!currentUserHasTakenTest) {
      return 'Пройдите тест, чтобы разблокировать результат';
    }
    if (!userHasTakenTest) {
      return `${username || 'Пользователь'} не прошел тест`;
    }
    return `${compatibilityScore}%`;
  };

  // Determine if the circle should be gray
  const isGrayCircle = !currentUserHasTakenTest || !userHasTakenTest;
  
  // Анимация круга совместимости (Compatibility circle animation)
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(compatibilityScore);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [compatibilityScore]);
  
  return (
    <div className="flex justify-center -mt-8 relative z-10">
      <div 
        className="rounded-full w-24 h-24 flex items-center justify-center relative"
      >
        {/* Круг с анимацией (Animated circle) */}
        <div className="w-full h-full absolute top-0 left-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke={isGrayCircle ? "#4B5563" : "#FFDE03"} 
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset={`${283 - (283 * progress / 100)}`}
              className="transition-all duration-1500 ease-out"
            />
          </svg>
        </div>
        
        {/* Внутренний круг (Inner circle) */}
        <div className={`w-20 h-20 rounded-full ${isGrayCircle ? 'bg-gray-500/90' : compatibilityBgClass} flex items-center justify-center transition-all duration-1000`}>
          <div className="w-10 h-10 rounded-full bg-todoDarkGray absolute"></div>
          <span className={`${isGrayCircle ? 'text-white' : 'text-black'} font-bold text-sm text-center px-2 absolute`}>
            {getCompatibilityText()}
          </span>
        </div>
      </div>
    </div>
  );
};
