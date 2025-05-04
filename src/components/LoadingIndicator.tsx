
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  submessage?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  message = 'Загрузка...',
  submessage,
  className = '',
}) => {
  const isMobile = useIsMobile();
  
  // Size configurations
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  };
  
  // Text size configurations
  const textSizeClasses = {
    small: 'text-sm mt-2',
    medium: 'text-base mt-3',
    large: 'text-lg mt-4',
  };
  
  // Submessage size configurations
  const submessageSizeClasses = {
    small: 'text-xs mt-1',
    medium: 'text-sm mt-2',
    large: 'text-base mt-2',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-todoYellow border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-todoYellow border-opacity-20 rounded-full animate-pulse-soft`}></div>
      </div>
      
      {message && (
        <p className={`text-white/90 ${textSizeClasses[size]} animate-fade-in`}>
          {message}
        </p>
      )}
      
      {submessage && (
        <p className={`text-white/70 ${submessageSizeClasses[size]} animate-fade-in animation-delay-300`}>
          {submessage}
        </p>
      )}
    </div>
  );
};

export default LoadingIndicator;
