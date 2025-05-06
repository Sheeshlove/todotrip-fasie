
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Get compatibility color classes based on score
  const compatibilityBgClass = getCompatibilityBgColor(compatibilityScore);
  const strokeColor = isGrayCircle ? "#4B5563" : 
                     compatibilityScore >= 80 ? "#22c55e" :
                     compatibilityScore >= 50 ? "#FFDE03" :
                     compatibilityScore >= 25 ? "#f97316" : "#ef4444";

  // Get the text for the compatibility circle
  const getCompatibilityText = () => {
    if (isLoading) {
      return '...';
    }
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
    // Initial loading animation
    setIsLoading(true);
    
    // First show loading animation for 1.5 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Then animate to the actual progress value
      const progressTimer = setTimeout(() => {
        setProgress(compatibilityScore);
      }, 300);
      
      return () => clearTimeout(progressTimer);
    }, 1500);
    
    return () => clearTimeout(loadingTimer);
  }, [compatibilityScore]);
  
  // Calculate the circumference of the circle
  const circleRadius = 46;
  const circumference = 2 * Math.PI * circleRadius;
  
  // Calculate the stroke dashoffset based on progress
  const strokeDashoffset = circumference - (circumference * progress / 100);
  
  return (
    <div className="flex justify-center -mt-10 relative z-10">
      <div className="rounded-full w-24 h-24 flex items-center justify-center relative">
        {/* Внешнее кольцо с анимацией (Animated outer ring) */}
        <div className="w-full h-full absolute top-0 left-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke="#333333" 
              strokeWidth="1.5"
              className="opacity-20"
            />
            
            {/* Progress circle with animation */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={isLoading ? 0 : strokeDashoffset}
              strokeLinecap="round"
              className={isLoading ? "animate-spin-slow origin-center" : "transition-all duration-1500 ease-out"}
              style={{ transformOrigin: 'center', transform: isLoading ? 'rotate(-90deg)' : 'rotate(-90deg)' }}
            />
          </svg>
        </div>
        
        {/* Среднее кольцо (Middle ring) - decorative */}
        <div className="w-[90px] h-[90px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 backdrop-blur-sm"></div>
        
        {/* Внутренний круг (Inner circle) */}
        <div className={`w-[86px] h-[86px] rounded-full ${isLoading ? 'bg-gray-700/80' : (isGrayCircle ? 'bg-gray-500/80' : compatibilityBgClass)} flex items-center justify-center transition-all duration-1000 backdrop-blur-sm`}>
          <div className="w-10 h-10 rounded-full bg-todoDarkGray/90 absolute"></div>
          <span className={`${isGrayCircle || isLoading ? 'text-white/90' : 'text-black'} font-bold text-sm text-center px-2 absolute ${isLoading ? 'animate-pulse' : ''}`}>
            {getCompatibilityText()}
          </span>
        </div>
      </div>
    </div>
  );
};

