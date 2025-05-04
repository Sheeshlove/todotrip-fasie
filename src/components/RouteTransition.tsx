
import React from 'react';

const RouteTransition = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center py-4">
        <div className="w-full max-w-md">
          <div className="h-1 w-full bg-todoYellow/20 relative overflow-hidden rounded-full">
            <div className="h-full bg-todoYellow absolute left-0 top-0 animate-pulse-soft rounded-full w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTransition;
