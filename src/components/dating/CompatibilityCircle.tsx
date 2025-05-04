
import React, { useEffect, useState } from 'react';
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
  // Анимация заполнения круга (Circle fill animation)
  const [progress, setProgress] = useState(0);
  
  // Get compatibility color classes based on score
  const compatibilityBgClass = getCompatibilityBgColor(compatibilityScore);

  // Get the text for the compatibility circle
  const getCompatibilityText = () => {
    if (!currentUserHasTakenTest) {
      return 'Пройдите тест';
    }
    if (!userHasTakenTest) {
      return `Ждёт теста`;
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
    <div className="flex justify-center -mt-10 relative z-10">
      <div className="rounded-full w-24 h-24 flex items-center justify-center relative">
        {/* Внешнее кольцо с анимацией (Animated outer ring) */}
        <div className="w-full h-full absolute top-0 left-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke={isGrayCircle ? "#4B5563" : "#FFDE03"} 
              strokeWidth="1.5"
              strokeDasharray="289"
              strokeDashoffset={`${289 - (289 * progress / 100)}`}
              className="transition-all duration-1500 ease-out"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Среднее кольцо (Middle ring) - decorative */}
        <div className="w-[90px] h-[90px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 backdrop-blur-sm"></div>
        
        {/* Внутренний круг (Inner circle) */}
        <div className={`w-[86px] h-[86px] rounded-full ${isGrayCircle ? 'bg-gray-500/80' : compatibilityBgClass} flex items-center justify-center transition-all duration-1000 backdrop-blur-sm`}>
          <div className="w-10 h-10 rounded-full bg-todoDarkGray/90 absolute"></div>
          <span className={`${isGrayCircle ? 'text-white/90' : 'text-black'} font-bold text-sm text-center px-2 absolute`}>
            {getCompatibilityText()}
          </span>
        </div>
      </div>
    </div>
  );
};
