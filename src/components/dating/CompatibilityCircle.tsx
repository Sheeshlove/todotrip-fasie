
import React from 'react';
import { getCompatibilityBgColor } from '@/services/compatibilityService';

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
  
  return (
    <div className="flex justify-center -mt-8 relative z-10">
      <div 
        className={`${isGrayCircle ? 'bg-gray-500/90' : compatibilityBgClass} rounded-full w-24 h-24 flex items-center justify-center border-4 border-todoDarkGray`}
      >
        <div className="w-10 h-10 rounded-full bg-todoDarkGray absolute"></div>
        <span className={`${isGrayCircle ? 'text-white' : 'text-black'} font-bold text-sm text-center px-2 absolute`}>
          {getCompatibilityText()}
        </span>
      </div>
    </div>
  );
};
