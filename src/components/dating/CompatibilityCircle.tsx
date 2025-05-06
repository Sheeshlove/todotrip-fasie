
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

  // Get color based on compatibility score
  const strokeColor = isGrayCircle 
    ? "#4B5563" 
    : compatibilityScore >= 80 
      ? "#22c55e" 
      : compatibilityScore >= 50 
        ? "#FFDE03" 
        : compatibilityScore >= 25 
          ? "#f97316" 
          : "#ef4444";

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

  // SVG configuration
  const size = 120;
  const strokeWidth = 2;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex justify-center -mt-10 relative z-10">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Background circle */}
        <svg 
          className="absolute" 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="text-gray-200/20"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Progress circle with animation */}
        <svg 
          className="absolute transform -rotate-90" 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="transition-all duration-1000 ease-in-out"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isLoading ? circumference : strokeDashoffset,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="z-10 flex items-center justify-center">
          <span 
            className={`text-center ${isGrayCircle || isLoading ? 'text-gray-300/90' : 'text-white'} font-bold ${isLoading ? 'animate-pulse' : ''}`}
            style={{ fontSize: '1.1rem' }}
          >
            {getCompatibilityText()}
          </span>
        </div>
      </div>
    </div>
  );
};
