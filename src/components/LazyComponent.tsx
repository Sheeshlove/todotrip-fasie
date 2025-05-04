
import React, { Suspense } from 'react';
import LoadingIndicator from './LoadingIndicator';

interface LazyComponentProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  submessage?: string;
  className?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  size = 'medium',
  message = 'Загрузка...',
  submessage,
  className = '',
}) => {
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingIndicator 
          size={size} 
          message={message}
          submessage={submessage}
        />
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default LazyComponent;
