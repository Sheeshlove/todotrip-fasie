
import React, { Suspense } from 'react';
import RouteTransition from './RouteTransition';
import LoadingIndicator from './LoadingIndicator';

interface LazyComponentProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  submessage?: string;
  className?: string;
  useMinimalLoader?: boolean;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  size = 'medium',
  message = 'Загрузка...',
  submessage,
  className = '',
  useMinimalLoader = false,
}) => {
  return (
    <Suspense fallback={
      useMinimalLoader ? 
      <RouteTransition /> : 
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
