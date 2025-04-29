import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-todoBlack">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-todoYellow" />
        <p className="text-todoYellow font-medium">Загрузка...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 