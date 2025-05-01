
import React from 'react';
import { Loader2, Save } from 'lucide-react';

interface FormStatusIndicatorProps {
  isUpdating: boolean;
  needsSaving: boolean;
}

export const FormStatusIndicator: React.FC<FormStatusIndicatorProps> = ({ isUpdating, needsSaving }) => {
  return (
    <div className="flex items-center justify-end text-sm">
      {isUpdating ? (
        <div className="flex items-center bg-black/20 px-4 py-2 rounded-full">
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-todoYellow" />
          <span className="text-gray-300">Сохранение...</span>
        </div>
      ) : needsSaving ? (
        <div className="flex items-center bg-amber-900/20 text-amber-300 px-4 py-2 rounded-full">
          <span className="text-xs">Ожидание сохранения...</span>
        </div>
      ) : (
        <div className="flex items-center bg-green-900/20 text-green-300 px-4 py-2 rounded-full">
          <Save className="w-4 h-4 mr-1" />
          <span className="text-xs">Все изменения сохранены</span>
        </div>
      )}
    </div>
  );
};
