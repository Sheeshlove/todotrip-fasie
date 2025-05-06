
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
  
  // Determine if the circle should be gray
  const isGrayCircle = !currentUserHasTakenTest || !userHasTakenTest;
  
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
            {/* Background circle - thinner */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke="#333333" 
              strokeWidth="0.8"
              className="opacity-20"
            />
            
            {/* Progress circle with animation - thinner */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="transparent" 
              stroke={strokeColor}
              strokeWidth="1"
              strokeDasharray={circumference}
              strokeDashoffset={isLoading ? 0 : strokeDashoffset}
              strokeLinecap="round"
              className={isLoading ? "animate-spin-slow origin-center" : "transition-all duration-1500 ease-out"}
              style={{ transformOrigin: 'center', transform: isLoading ? 'rotate(-90deg)' : 'rotate(-90deg)' }}
            />
          </svg>
        </div>
        
        {/* Removed middle ring completely */}
        
        {/* Replaced large inner circle with a small dot */}
        <div className="flex items-center justify-center">
          {/* Small center dot */}
          <div className={`w-2 h-2 rounded-full ${isGrayCircle ? 'bg-gray-500' : strokeColor} transition-all duration-1000`}></div>
          
          {/* Text positioned outside the circle */}
          <span className={`absolute ${isGrayCircle || isLoading ? 'text-white/90' : 'text-white'} font-bold text-sm ${isLoading ? 'animate-pulse' : ''}`}>
            {getCompatibilityText()}
          </span>
        </div>
      </div>
    </div>
  );
};
