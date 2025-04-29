
import React from 'react';
import { Loader2 } from 'lucide-react';

interface TestLoadingProps {
  message?: string;
}

export const TestLoading: React.FC<TestLoadingProps> = ({
  message = "Обработка результатов..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-10 w-10 animate-spin text-todoYellow mb-4" />
      <p className="text-white">{message}</p>
    </div>
  );
};
